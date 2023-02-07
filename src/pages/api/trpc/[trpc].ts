import { createNextApiHandler } from '@trpc/server/adapters/next';
import { env } from 'process';

import { createContext } from '../../../server/trpc/context';
import { appRouter } from '../../../server/trpc/router/_app';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ error, path }) => {
    // if (error.code === 'NOT_FOUND') {
    //   // TODO if there is a prisma error thrown we always have to wrap/catch it
    //   // If its a 404 we can give out more information
    // }
    // console.log(error);

    // if (error.cause instanceof PrismaClientKnownRequestError) {
    //   throw new TRPCError({
    //     code: 'NOT_FOUND',
    //     // message: error.cause.message,
    //     message: 'Lulw',
    //   });
    // }

    if (env.NODE_ENV === 'development') {
      console.error(`❌ tRPC failed on ${path}: ${error}`);
    } else {
      return undefined;
    }
  },
});
