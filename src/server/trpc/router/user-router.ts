import { zUserUpdateInput } from '../../../types/zod-user';
import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  update: protectedProcedure.input(zUserUpdateInput).mutation(async ({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        ...input,
      },
    });
  }),
});
