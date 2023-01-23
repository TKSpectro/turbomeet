import { router } from '../trpc';
import { meetingPublicRouter } from './meeting-public-router';
import { meetingRouter } from './meeting-router';

export const appRouter = router({
  meeting: meetingRouter,
  meetingPublic: meetingPublicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
