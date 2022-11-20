import type { Meeting } from '@prisma/client';
import Head from 'next/head';
import { Loading } from '../ui';

type Props = {
  adminView: boolean;
  meeting: Meeting | null | undefined;
  isLoading: boolean;
};

export function MeetingPage({ adminView, meeting, isLoading }: Props) {
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
}
