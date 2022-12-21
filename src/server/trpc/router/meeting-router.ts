import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const meetingRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.meeting.findMany({
      where: { participants: { some: { id: ctx.session.user.id } } },
      orderBy: { deadline: 'desc' },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullable(),
        deadline: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
