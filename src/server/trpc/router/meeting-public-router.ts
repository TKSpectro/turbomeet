import { Answer } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { sendMail } from '../../mail/client';

import { publicProcedure, router } from '../trpc';

export const meetingPublicRouter = router({
  vote: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        meetingId: z.string(),
        votes: z.array(z.object({ appointmentId: z.string(), answer: z.nativeEnum(Answer) })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        let user = await tx.user.findFirst({
          where: { email: input.email },
        });

        if (user) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Please login to vote',
          });
        } else {
          user = await tx.user.create({
            data: {
              email: input.email,
              name: input.email.split('@')[0],
            },
          });
        }

        if (!user) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Could not create user',
          });
        }

        const meeting = await tx.meeting.findFirst({
          where: {
            id: input.meetingId,
            public: true,
          },
          include: {
            appointments: {
              where: { meetingId: input.meetingId },
            },
          },
        });

        if (!meeting) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Meeting not found',
          });
        }

        if (meeting.closed || (meeting.deadline && meeting.deadline < new Date())) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Meeting closed or deadline has passed',
          });
        }

        await tx.meeting.update({
          where: {
            id: input.meetingId,
          },
          data: {
            participants: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        const votes = input.votes.map((vote) => ({
          appointmentId: vote.appointmentId,
          answer: vote.answer,
          userId: user?.id,
          meetingId: input.meetingId,
        }));

        // Add NO votes for all appointments that are not in the input
        for (const appointment of meeting.appointments) {
          if (votes.findIndex((v) => v.appointmentId === appointment.id) === -1) {
            votes.push({
              appointmentId: appointment.id,
              answer: Answer.NO,
              userId: user?.id,
              meetingId: input.meetingId,
            });
          }
        }

        const result = [];
        for (const vote of votes) {
          result.push(
            await tx.vote.create({
              data: vote,
            }),
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sendMail('VOTED_PUBLIC_MEETING_NO_ACCOUNT', user.email!, {
          meetingTitle: meeting.title,
        });

        return result;
      });
    }),
});
