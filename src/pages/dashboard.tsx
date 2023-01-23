import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Loading } from '../components/ui/loading';
import { trpc } from '../utils/trpc';

const Dashboard: NextPage = () => {
  const { data: meetings, isLoading } = trpc.meeting.getAll.useQuery();

  const { data: meetingsToVoteOn, isLoading: isLoadingToVoteOn } = trpc.meeting.getAll.useQuery({
    haveToVote: true,
  });

  return (
    <>
      <Head>
        <title>turbomeet | Dashboard</title>
        <meta name="description" content="turbomeet | Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-4 px-8">
        <h1 className="text-3xl font-extrabold leading-normal text-gray-700 lg:text-6xl ">
          Dashboard
        </h1>

        <h2 className="mt-4 text-xl  font-bold leading-normal text-slate-200 lg:text-3xl">
          Meetings you have to vote on
        </h2>
        {isLoading && <Loading width={200} height={200} />}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {meetingsToVoteOn?.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meeting/${meeting.id}`}
              className="rounded-lg border-2 border-gray-800"
            >
              <div className="p-2">
                <div className="text-lg font-semibold text-slate-100">{meeting.title}</div>
                <div className="truncate">{meeting.description}</div>
                <div className="text-slate-100">{meeting.deadline?.toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mt-4 text-xl  font-bold leading-normal text-slate-200 lg:text-3xl">
          Upcoming meetings
        </h2>
        {isLoading && <Loading width={200} height={200} />}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {meetings?.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meeting/${meeting.id}`}
              className="rounded-lg border-2 border-gray-800"
            >
              <div className="p-2">
                <div className="text-lg font-semibold text-slate-100">{meeting.title}</div>
                <div className="truncate">{meeting.description}</div>
                <div className="text-slate-100">{meeting.deadline?.toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
