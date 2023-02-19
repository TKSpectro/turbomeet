import { router } from '../trpc';
import { meetingPublicRouter } from './meeting-public-router';
import { meetingRouter } from './meeting-router';
import { userRouter } from './user-router';

export const appRouter = router({
  meeting: meetingRouter,
  meetingPublic: meetingPublicRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
