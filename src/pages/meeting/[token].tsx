import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loading } from '../../components/ui/loading';
import { trpc } from '../../utils/trpc';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { data: meeting, isLoading } = trpc.meetingPublic.getOne.useQuery({
    token: token as string,
  });

  return (
    <>
      <Head>
        <title>turbomeet | Meeting</title>
        <meta name="description" content="turbomeet | Meeting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        {isLoading && <Loading width={200} height={200} />}
        {meeting && (
          <div key={meeting.id} className="border border-gray-800">
            <div>
              <p>{meeting.title}</p>
              <p>{meeting.description}</p>
              <p>{meeting.deadline?.toLocaleString()}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
