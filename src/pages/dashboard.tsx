import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import { date, z } from 'zod';

const Dashboard: NextPage = () => {
  const { data: meetings, isLoading, refetch } = trpc.useQuery(['meeting.getAll']);

  const form = useZodForm({
    schema: z.object({
      title: z.string().min(1, { message: 'Must be at least 1 character long' }),
      description: z
        .string()
        .max(300, { message: 'Must be 300 or less characters long' })
        .nullable(),
      deadline: z.preprocess((arg) => {
        if (arg && (typeof arg == 'string' || arg instanceof Date)) return new Date(arg);
        return null;
      }, z.nullable(date())),
    }),
  });

  const { mutate: createMeeting } = trpc.useMutation(['meeting.create'], {
    onSuccess() {
      refetch();
      form.reset();
    },
  });

  return (
    <>
      <Head>
        <title>mapper | Dashboard</title>
        <meta name="description" content="mapper | Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Dashboard
        </h1>
        <Form form={form} onSubmit={(data) => createMeeting(data)}>
          <Input label="Title" {...form.register('title')} placeholder="Sprint Meeting 1" />
          <Input label="Description" {...form.register('description')} />
          <Input label="Deadline" type="datetime-local" {...form.register('deadline')} />

          <Button type="submit">Submit</Button>
        </Form>
        {isLoading && <Loading width={200} height={200} />}
        {meetings?.map((meeting) => (
          <div key={meeting.id} className="border border-gray-800">
            <div>
              <p>{meeting.title}</p>
              <p>{meeting.description}</p>
              <p>{meeting.deadline?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </main>
    </>
  );
};

export default Dashboard;
