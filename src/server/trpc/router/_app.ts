import { router } from '../trpc';
import { meetingPublicRouter } from './meeting-public-router';
import { meetingRouter } from './meeting-router';
import { todoRouter } from './todo-router';

export const appRouter = router({
  todo: todoRouter,
  meeting: meetingRouter,
  meetingPublic: meetingPublicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
