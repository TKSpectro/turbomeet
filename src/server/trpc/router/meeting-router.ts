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
});
