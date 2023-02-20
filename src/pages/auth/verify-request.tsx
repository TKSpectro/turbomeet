import { ArrowLeftIcon } from '@radix-ui/react-icons';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { getCsrfToken, getProviders } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

const VerifyRequest = ({
  csrfToken,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  return (
    <>
      <Head>
        <title>turbomeet | Login</title>
        <meta name="description" content="turbomeet | Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid h-screen w-screen place-items-center justify-center p-4 px-4 text-sm font-medium dark:bg-gray-900">
        <div className="w-full max-w-sm rounded-lg bg-gray-200/50 p-6 text-center shadow dark:bg-gray-700/30">
          <div className="mb-4 text-3xl font-semibold">Check your email</div>
          <div className="mb-6 text-xl font-normal">
            A sign in link has been sent to your email address.
          </div>
          <Link href="/auth/login" className="flex items-center justify-center">
            <ArrowLeftIcon className="mr-1 h-5 w-5" />
            Go back
          </Link>
        </div>

        {/* <div>
          <form method="post" action="/api/auth/signin/email">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              Email address
              <input type="email" id="email" name="email" />
            </label>
            <button type="submit">Sign in with Email</button>
          </form>
          <hr />
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} style={{ marginBottom: 0 }}>
                <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
              </div>
            ))}
        </div> */}
      </main>
    </>
  );
};

export default VerifyRequest;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/dashboard' } };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
