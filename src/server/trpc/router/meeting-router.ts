import type { User } from '@prisma/client';
import { Answer } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createTransport } from 'nodemailer';
import { z } from 'zod';
import { zMeetingCreateInput, zMeetingUpdateInput } from '../../../types/zod-meeting';
import { protectedProcedure, router } from '../trpc';

export const meetingRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.meeting.findMany({
      where: {
        participants: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });
  }),
  getAllToVoteOn: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.meeting.findMany({
      where: {
        closed: false,
        OR: [{ deadline: { gte: new Date() } }, { deadline: null }],
        participants: {
          some: {
            id: ctx.session.user.id,
          },
        },
        appointments: {
          every: {
            votes: {
              none: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });
  }),
  getAllForCmdK: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.meeting.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        participants: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      orderBy: { title: 'asc' },
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const meeting = await ctx.prisma.meeting.findFirst({
        where: { id: input.token, participants: { some: { id: ctx.session.user.id } } },
        include: {
          appointments: {
            where: { meetingId: input.token },
          },
          participants: {
            include: {
              votes: {
                where: { appointment: { meetingId: input.token } },
              },
            },
          },
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }

      return meeting;
    }),
  getOneAsAdmin: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const meeting = await ctx.prisma.meeting.findFirst({
        where: { id: input.token, ownerId: ctx.session.user.id },
        include: {
          appointments: {
            include: {
              votes: {
                include: { user: true },
                where: { appointment: { meetingId: input.token } },
              },
            },
          },
          participants: {
            include: {
              votes: {
                include: { user: true },
                where: { appointment: { meetingId: input.token } },
              },
            },
          },
        },
      });
      if (!meeting) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Meeting not found',
        });
      }

      return meeting;
    }),
  create: protectedProcedure.input(zMeetingCreateInput).mutation(async ({ ctx, input }) => {
    let deadline: Date | null = null;
    if (input.deadline) {
      deadline = new Date(input.deadline);
    }

    const participants = await ctx.prisma.user.findMany({
      where: {
        email: {
          in: input.participants || [],
          mode: 'insensitive',
        },
      },
    });

    if (input.participants) {
      for (const participant of input.participants) {
        if (!participants.some((value) => value.email === participant)) {
          participants.push(
            await ctx.prisma.user.create({
              data: {
                email: participant,
                name: participant.split('@')[0],
              },
            }),
          );

          try {
            const transporter = createTransport({
              url: process.env.EMAIL_SERVER,
            });

            transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: participant,
              subject: 'You have been invited to a meeting',
              text: `You have been invited to the meeting ${input.title} by ${ctx.session.user.name}. As you currently have no account on this platform, you can create one by clicking on the following link: ${process.env.NEXTAUTH_URL}/auth/login. (Please use the same email address as you have been invited with.)`,
            });
          } catch (error) {
            console.error('Error while sending email', error);
          }
        }
      }
    }

    return await ctx.prisma.meeting.create({
      data: {
        title: input.title,
        description: input.description,
        deadline: deadline,
        participants: {
          connect: [
            { id: ctx.session.user.id },
            ...participants.map((p) => {
              return { id: p.id };
            }),
          ],
        },
        owner: { connect: { id: ctx.session.user.id } },
        ownerUsername: ctx.session.user.name,
        appointments: {
          createMany: {
            data: input.appointments?.map((value) => ({
              value,
            })),
          },
        },
      },
    });
  }),
  update: protectedProcedure.input(zMeetingUpdateInput).mutation(async ({ ctx, input }) => {
    const meeting = await ctx.prisma.meeting.findUnique({ where: { id: input.id } });
    if (!meeting) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Meeting not found',
      });
    }

    const oldParticipants = await ctx.prisma.user.findMany({
      where: {
        email: {
          in: input.data.participants || [],
          mode: 'insensitive',
        },
      },
    });

    const newParticipants: User[] = [];

    if (input.data.participants) {
      for (const participant of input.data.participants) {
        if (!oldParticipants.some((value) => value.email === participant)) {
          newParticipants.push(
            await ctx.prisma.user.create({
              data: {
                email: participant,
                name: participant.split('@')[0],
              },
            }),
          );

          try {
            const transporter = createTransport({
              url: process.env.EMAIL_SERVER,
            });

            transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: participant,
              subject: 'You have been invited to a meeting',
              text: `You have been invited to the meeting ${meeting.title} by ${ctx.session.user.name}. As you currently have no account on this platform, you can create one by clicking on the following link: ${process.env.NEXTAUTH_URL}/auth/login. (Please use the same email address as you have been invited with.)`,
            });
          } catch (error) {
            console.error('Error while sending email', error);
          }
        }
      }
    }

    return await ctx.prisma.meeting.update({
      where: { id: input.id },
      data: {
        ...input.data,
        participants: {
          connect: newParticipants.map((p) => {
            return { id: p.id };
          }),
        },
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), titleRepeat: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.prisma.meeting.findUnique({
        where: {
          id: input.id,
        },
      });

      if (meeting?.title !== input.titleRepeat) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Repeated title does not match the selected meeting',
        });
      }

      return await ctx.prisma.meeting.delete({
        where: {
          id: input.id,
        },
      });
    }),
  vote: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
        votes: z.array(z.object({ appointmentId: z.string(), answer: z.nativeEnum(Answer) })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.prisma.meeting.findFirst({
        where: { id: input.meetingId, participants: { some: { id: ctx.session.user.id } } },
        include: {
          appointments: {
            where: { meetingId: input.meetingId },
            include: {
              votes: {
                where: { userId: ctx.session.user.id, appointment: { meetingId: input.meetingId } },
              },
            },
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
          message: 'Meeting deadline has passed',
        });
      }

      const votes = input.votes.map((vote) => ({
        id: meeting.appointments.find((a) => a.id === vote.appointmentId)?.votes[0]?.id || '1',
        appointmentId: vote.appointmentId,
        answer: vote.answer,
        userId: ctx.session.user.id,
        meetingId: input.meetingId,
      }));

      for (const appointment of meeting.appointments) {
        if (
          votes.findIndex((v) => v.appointmentId === appointment.id) === -1 &&
          appointment.votes.findIndex(
            (v) => v.userId === ctx.session.user.id && v.appointmentId === appointment.id,
          ) === -1
        ) {
          votes.push({
            id: '1',
            appointmentId: appointment.id,
            answer: Answer.NO,
            userId: ctx.session.user.id,
            meetingId: input.meetingId,
          });
        }
      }

      const result = [];
      for (const vote of votes) {
        result.push(
          await ctx.prisma.vote.upsert({
            where: {
              id: vote.id,
            },
            create: { ...vote, id: undefined },
            update: { answer: vote.answer },
          }),
        );
      }
    }),
});
