import type { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from '../components/ui/button';

const Profile: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>turbomeet | Profile</title>
        <meta name="description" content="turbomeet | Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Profile
        </h1>
        <>
          Signed in as {session?.user?.name} <br />
          Email: {session?.user?.email} <br />
          {session?.user?.image && (
            <Image src={session.user.image} alt="Profile picture" width={100} height={100} />
          )}
          <Button variant="info" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </Button>
        </>
      </main>
    </>
  );
};

export default Profile;
