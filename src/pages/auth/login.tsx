import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

const ERROR_CODES: { [key: string]: string } = {
  OAuthSignin: 'There was an error signing in with OAuth.',
  OAuthCallback: 'There was an error signing in with OAuth.',
  OAuthCreateAccount: 'There was an error creating an account with OAuth.',
  EmailCreateAccount: 'There was an error creating an account with email.',
  Callback: 'There was an error signing in.',
  OAuthAccountNotLinked:
    'This account is already linked to an existing account, but not with this provider.',
  EmailSignin: 'There was an error signing in with email.',
  CredentialsSignin: 'There was an error signing in with credentials.',
  SessionRequired: 'You must be signed in to access this resource.',
  Default: 'An error has occurred. Please try again.',
};

const Login = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');

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
          <form className="p-4 md:p-5 lg:p-6">
            <div className="grid gap-y-3">
              {error && (
                <div className="flex items-center justify-start gap-x-2 rounded-md bg-red-50 p-2 text-red-900 dark:bg-red-900/20 dark:text-red-50">
                  <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="button"
                className="flex items-center justify-center gap-x-2 rounded-md border border-gray-400 bg-gray-50 py-3 px-4 text-gray-900 transition hover:text-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:hover:text-emerald-400"
                onClick={async () => {
                  await signIn('github');
                }}
              >
                <svg
                  style={{ color: 'text-gray-900 dark:text-gray-50' }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="text-gray-900 dark:text-gray-50"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                    fill="text-gray-900 dark:text-gray-50"
                  ></path>
                </svg>
                Sign in with Github
              </button>
              {/* <button className="flex items-center justify-center gap-x-2 rounded-md border border-gray-600 bg-gray-700 py-3 px-4 text-gray-50 transition hover:text-emerald-400">
                <svg
                  style={{ color: 'text-gray-900 dark:text-gray-50' }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="text-gray-900 dark:text-gray-50"
                  className="bi bi-google"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                    fill="text-gray-900 dark:text-gray-50"
                  ></path>
                </svg>
                Sign in with Google
              </button> */}
            </div>

            <div className="my-3 flex items-center px-3">
              <hr className="w-full border-gray-400 dark:border-gray-600" />
              <span className="mx-3 text-gray-500">or</span>
              <hr className="w-full border-gray-400 dark:border-gray-600" />
            </div>

            <div className="grid gap-y-3">
              <input
                className="rounded-md border border-gray-400 bg-gray-50 py-3 px-4 text-gray-900 outline-none transition placeholder:text-gray-600 focus:border-emerald-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                placeholder="email@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                type="email"
              />
              <button
                type="button"
                onClick={async () => {
                  await signIn('email', { email: email });
                }}
                className="flex items-center justify-center gap-x-2 rounded-md border border-gray-400 bg-gray-50 py-3 px-4 text-gray-900 transition hover:text-emerald-500 dark:border-gray-600 dark:bg-gray-700  dark:text-gray-50 dark:hover:text-emerald-400"
              >
                <svg
                  style={{ color: isLight ? 'text-gray-900' : 'text-gray-50' }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill={clsx({ 'text-gray-50': !isLight, 'text-gray-900': isLight })}
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                    fill={clsx({ 'text-gray-50': !isLight, 'text-gray-900': isLight })}
                  ></path>
                </svg>
                Sign in with Email
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: '/dashboard' } };
  }

  return {
    props: {},
  };
}
