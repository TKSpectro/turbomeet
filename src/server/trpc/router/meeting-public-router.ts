import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const meetingPublicRouter = router({
  getOne: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.meeting.findUnique({
        where: {
          id: input.token,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        username: z.string(),
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

      const meeting = await ctx.prisma.meeting.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: deadline,
          ownerUsername: input.username,
        },
      });

      return meeting;
    }),
});
