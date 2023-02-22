import { ArrowLeftIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authOptions } from '../api/auth/[...nextauth]';

const ERROR_CODES: { [key: string]: string } = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have access to this resource.',
  Verification: 'The token has expired or has already been used.',
  Default: 'An error has occurred. Please try again.',
};

const NextAuthError = ({ session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { error: errorParam } = router.query;
  const error = errorParam ? ERROR_CODES[errorParam as string] : undefined;

  return (
    <>
      <Head>
        <title>turbomeet | Login</title>
        <meta name="description" content="turbomeet | Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid h-screen w-screen place-items-center justify-center bg-gray-50 p-4 px-4 text-sm font-medium dark:bg-gray-900">
        <div className="w-full max-w-sm rounded-lg bg-gray-200/70 shadow dark:bg-gray-700/30">
          <div className="p-4 md:p-5 lg:p-6">
            <div className="grid gap-y-3">
              {error && (
                <div className="flex items-center justify-start gap-x-2 rounded-md bg-red-50 p-2 text-red-900 dark:bg-red-900/20 dark:text-red-50">
                  <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {!error && (
                <>
                  <div className="flex items-center justify-start gap-x-2 rounded-md bg-red-50 p-2 text-red-900 dark:bg-red-900/20 dark:text-red-50">
                    <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                  <Link
                    href={session ? '/dashboard' : '/auth/login'}
                    className="flex items-center justify-center"
                  >
                    <ArrowLeftIcon className="mr-1 h-5 w-5" />
                    Go back to {session ? 'dashboard' : 'login'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NextAuthError;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: { session: !!session },
  };
}
