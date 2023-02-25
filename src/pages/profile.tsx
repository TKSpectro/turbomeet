import type { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { Input } from '../components/ui';
import { Button } from '../components/ui/button';
import { Form, useZodForm } from '../components/ui/form';
import { zUserUpdateInput } from '../types/zod-user';
import { trpc } from '../utils/trpc';

const Profile: NextPage = () => {
  const { data: session } = useSession();

  const profileForm = useZodForm({
    schema: zUserUpdateInput,
    values: {
      name: session?.user?.name ?? undefined,
    },
    mode: 'all',
  });

  const { mutate: updateProfile, error } = trpc.user.update.useMutation();

  return (
    <>
      <Head>
        <title>turbomeet | Profile</title>
        <meta name="description" content="turbomeet | Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-800 dark:text-gray-200 md:text-[5rem]">
          Profile
        </h1>
        <div>
          {session?.user?.image && (
            <Image src={session.user.image} alt="Profile picture" width={100} height={100} />
          )}
          <Form
            form={profileForm}
            onSubmit={() => {
              updateProfile(profileForm.getValues());
            }}
          >
            <Input label="Name" {...profileForm.register('name')} />
            <Input
              label="Email - (Can't change)"
              readOnly
              disabled
              value={session?.user?.email ?? ''}
            />

            <Button
              type="submit"
              className="mt-2"
              disabled={!profileForm.formState.isDirty || !profileForm.formState.isValid}
            >
              Save profile information
            </Button>
          </Form>

          <Button
            variant="danger"
            fullWidth
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-8"
          >
            Sign out
          </Button>
        </div>
      </main>
    </>
  );
};

export default Profile;
