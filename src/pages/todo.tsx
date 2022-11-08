import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { trpc } from '@/utils/trpc';
import autoAnimate from '@formkit/auto-animate';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { HiOutlineCheckCircle, HiOutlineMinusCircle, HiOutlineTrash } from 'react-icons/hi';
import { z } from 'zod';

dayjs.extend(relativeTime);

const Todo: NextPage = () => {
  const { data: todos, isLoading, refetch: refetchTodos } = trpc.useQuery(['todo.getAll']);

  const { mutate: addTodo } = trpc.useMutation(['todo.create'], {
    onSuccess: () => refetchTodos(),
  });

  const { mutate: removeTodo } = trpc.useMutation(['todo.remove'], {
    onSuccess: () => refetchTodos(),
  });

  const { mutate: completeTodo } = trpc.useMutation(['todo.complete'], {
    onSuccess: () => refetchTodos(),
  });

  const form = useZodForm({
    schema: z.object({
      title: z.string().min(1, { message: 'Must be at least 1 character long' }),
      description: z
        .string()
        .max(300, { message: 'Must be 300 or less characters long' })
        .nullable(),
    }),
  });

  // Add autoanimate for the grid
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <>
      <Head>
        <title>mapper | Todo</title>
        <meta name="description" content="mapper | Todo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Todo
        </h1>
        <div className="pb-4">
          <Form
            form={form}
            onSubmit={(data) => {
              addTodo({
                ...data,
              });

              form.reset();
            }}
          >
            <Input label="Title" {...form.register('title')} placeholder="My Todo" />
            <Input label="Description" {...form.register('description')} />

            <Button type="submit">Submit</Button>
          </Form>
        </div>
        <div className="flex select-none flex-wrap justify-center gap-4 p-8" ref={parent}>
          {isLoading && <Loading width={200} height={200} />}
          {todos?.map((item) => (
            <div
              key={item.id}
              className={clsx(
                'animate-fade-in-down relative flex h-52 w-96 flex-col rounded border border-gray-500 bg-gray-200 shadow-xl dark:bg-gray-800',
                { 'opacity-50': item.completed },
              )}
            >
              <div className="flex justify-between border-b border-gray-500 p-4">
                {item.title}
                <div className="flex gap-4">
                  <button onClick={() => completeTodo({ id: item.id })}>
                    {item.completed ? (
                      <HiOutlineCheckCircle className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                    ) : (
                      <HiOutlineMinusCircle className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                    )}
                  </button>
                  <button onClick={() => removeTodo({ id: item.id })}>
                    <HiOutlineTrash className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                  </button>
                </div>
              </div>

              <div className={clsx('overflow-hidden text-ellipsis px-4 py-2')}>
                {item.description}
              </div>

              <div className="absolute bottom-0 w-full border-t border-gray-500 px-4 py-2 text-end">
                {dayjs(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Todo;
