import type { NextPage } from 'next';
import Head from 'next/head';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Form, useZodForm } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { trpc } from '../../utils/trpc';

const Dashboard: NextPage = () => {
  const {
    mutate: createMeeting,
    data,
    error,
  } = trpc.meetingPublic.create.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const form = useZodForm({
    schema: z.object({
      username: z.string().min(1, { message: 'Must be at least 1 character long' }),
      title: z.string().min(1, { message: 'Must be at least 1 character long' }),
      description: z
        .string()
        .max(300, { message: 'Must be 300 or less characters long' })
        .nullable(),
      deadline: z.date().nullable(),
    }),
  });

  return (
    <>
      <Head>
        <title>turbomeet | Meeting</title>
        <meta name="description" content="turbomeet | Meeting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          New Meeting
        </h1>
        <Form form={form} onSubmit={(data) => createMeeting(data)}>
          <Input label="Username" {...form.register('username')} />
          <Input label="Title" {...form.register('title')} placeholder="Sprint Meeting 1" />
          <Input label="Description" {...form.register('description')} />
          <Input
            label="Deadline"
            type="datetime-local"
            {...form.register('deadline', { value: null, valueAsDate: true })}
          />

          <Button type="submit">Submit</Button>
        </Form>

        {data && JSON.stringify(data, null, 2)}
        {error && JSON.stringify(error, null, 2)}
      </main>
    </>
  );
};

export default Dashboard;
