import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const todoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          completed: false,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.delete({ where: { id: input.id } });
    }),

  complete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({ where: { id: input.id } });

      return await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: !todo?.completed },
      });
    }),
});
