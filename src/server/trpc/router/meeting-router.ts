import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zMeetingCreateInput } from '../../../types/zod-meeting';
import { protectedProcedure, router } from '../trpc';

export const meetingRouter = router({
  getAll: protectedProcedure
    .input(z.object({ haveToVote: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      // const where = {};

      // if (input?.haveToVote === true) {
      //   where['participants'] = { some: { id: ctx.session.user.id, votes: { none: {} } } };
      // }

      return await ctx.prisma.meeting.findMany({
        where: {
          participants: {
            some: {
              id: ctx.session.user.id,
              // appointments: { some: { votes: { none: {} } } },
              // if haveToVote is set where there are no votes from this user
              // votes: input?.haveToVote === true ? { none: {} } : undefined,
            },
          },
          appointments:
            input?.haveToVote === true
              ? { every: { votes: { none: { userId: ctx.session.user.id } } } }
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
          participants: {
            include: {
              votes: {
                include: { appointment: { include: { times: true } } },
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
          participants: {
            include: {
              votes: {
                include: { appointment: { include: { times: true } } },
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
          create: input.appointments?.map((appointment) => ({
            date: new Date(appointment.date),
            times: {
              create: appointment.times.map((time) => ({
                start: time.start ? new Date(time.start) : null,
                end: time.end ? new Date(time.end) : null,
              })),
            },
          })),
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
