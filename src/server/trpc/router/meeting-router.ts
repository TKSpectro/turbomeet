import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zMeetingCreateInput } from '../../../types/zod-meeting';
import { protectedProcedure, router } from '../trpc';

export const meetingRouter = router({
  getAll: protectedProcedure
    .input(z.object({ haveToVote: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.meeting.findMany({
        where: {
          participants: {
            some: {
              id: ctx.session.user.id,
            },
          },
          appointments:
            input?.haveToVote === true
              ? {
                  every: {
                    votes: {
                      none: {
                        userId: ctx.session.user.id,
                      },
                    },
                  },
                }
              : undefined,
        },
        orderBy: { deadline: 'asc' },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.meeting.findFirst({
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

    return await ctx.prisma.meeting.create({
      data: {
        title: input.title,
        description: input.description,
        deadline: deadline,
        participants: { connect: { id: ctx.session.user.id } },
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
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: z.object({}) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.meeting.update({
        where: { id: input.id },
        data: input.data,
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
});
