import type { Meeting } from '@prisma/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Loading } from '../components/ui/loading';
import { trpc } from '../utils/trpc';

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  return (
    <Link
      href={`/meeting/${meeting.id}`}
      className="rounded-lg border-2 border-gray-200 dark:border-gray-800"
    >
      <div className="p-2 text-gray-800 dark:text-gray-200">
        <div className="text-lg font-semibold ">{meeting.title}</div>
        <div className="truncate text-gray-700 dark:text-gray-300">{meeting.description}</div>
        <div>{meeting.deadline?.toLocaleString()}</div>
      </div>
    </Link>
  );
};

const Dashboard: NextPage = () => {
  const { data: meetings, isLoading } = trpc.meeting.getAll.useQuery();

  const { data: meetingsToVoteOn } = trpc.meeting.getAllToVoteOn.useQuery();

  return (
    <>
      <Head>
        <title>turbomeet | Dashboard</title>
        <meta name="description" content="turbomeet | Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-4 px-8">
        <h1 className="text-3xl font-extrabold leading-normal text-gray-800 dark:text-gray-200 lg:text-6xl ">
          Dashboard
        </h1>

        {meetingsToVoteOn && meetingsToVoteOn.length > 0 && (
          <>
            <h2 className="mt-4 text-xl  font-bold leading-normal text-gray-700 dark:text-gray-300 lg:text-3xl">
              Meetings you have to vote on
            </h2>
            {isLoading && <Loading width={200} height={200} />}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {meetingsToVoteOn?.map((meeting) => (
                <MeetingCard meeting={meeting} key={meeting.id} />
              ))}
            </div>
          </>
        )}

        <h2 className="mt-4 text-xl font-bold leading-normal text-gray-700 dark:text-gray-300 lg:text-3xl">
          Upcoming meetings
        </h2>
        {isLoading && <Loading width={200} height={200} />}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {meetings?.map((meeting) => (
            <MeetingCard meeting={meeting} key={meeting.id} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
