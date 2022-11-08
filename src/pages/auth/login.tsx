import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';

const Login: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>mapper | Login</title>
        <meta name="description" content="mapper | Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex h-screen flex-col items-center justify-center p-4">
        {session ? (
          <>
            Signed in as {session?.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            Not signed in <br />
            <button onClick={() => signIn('github')}>Sign in</button>
          </>
        )}
      </main>
    </>
  );
};

export default Login;
