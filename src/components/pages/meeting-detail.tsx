import Head from 'next/head';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import type { RouterOutputs } from '../../utils/trpc';
import { Button, Loading } from '../ui';

type Props = {
  adminView: boolean;
  meeting: RouterOutputs['meeting']['getOne'] | null | undefined;
  isLoading: boolean;
};

export function MeetingDetailPage({ adminView, meeting, isLoading }: Props) {
  const [, copyToClipboard] = useCopyToClipboard();

  let meetingUrl = '';
  if (typeof window !== 'undefined') {
    meetingUrl = `${window.location.origin}/meeting/${meeting?.id}` || '';
  }

  const [didCopy, setDidCopy] = useState(false);

  const handleHide = () => {
    console.error('Hide not implemented yet.');
  };

  return (
    <>
      <Head>
        <title>turbomeet | Meeting</title>
        <meta name="description" content="turbomeet | Meeting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-full px-4 pt-4 md:w-[1024px] lg:min-h-[calc(100vh-64px)] ">
        {isLoading && <Loading width={200} height={200} />}
        {meeting && (
          <div>
            {adminView && (
              <div className="card p-4">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-lg font-semibold dark:text-slate-100">Share via link</div>
                  <button
                    onClick={handleHide}
                    className="h-8 items-center justify-center rounded-md px-3 text-slate-400 transition-colors hover:bg-slate-500/10 hover:text-slate-500 active:bg-slate-500/20"
                  >
                    Hide
                  </button>
                </div>
                <div className="mb-2 dark:text-slate-100">
                  This link can be given to other participants to allow them to vote for an
                  appointment
                </div>
                <div className="relative">
                  <input
                    readOnly={true}
                    className="mb-4 w-full rounded-md p-2 transition-all dark:bg-slate-700 dark:text-slate-100 md:mb-0 md:p-3 md:text-lg"
                    value={meetingUrl}
                  />
                  <Button
                    disabled={didCopy}
                    onClick={() => {
                      copyToClipboard(meetingUrl);
                      setDidCopy(true);
                      setTimeout(() => {
                        setDidCopy(false);
                      }, 500);
                    }}
                    className="md:absolute md:top-1/2 md:right-3 md:-translate-y-1/2"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}

            <div className="card mt-4 p-4">
              <div>
                <div className="text-xl font-semibold text-slate-100">{meeting.title}</div>
                <div className="text-slate-300">by {meeting.ownerUsername}</div>
              </div>
              <div></div>
              <div>
                <div className="flex shrink-0 items-center py-2 pl-4 pr-2">
                  <div className="flex h-full grow items-end">
                    {meeting.participants?.length} participant
                    {meeting.participants?.length > 1 && 's'}
                  </div>
                </div>
                <div>
                  {meeting.participants?.map((participant) => {
                    return (
                      <div key={participant.id}>
                        <div className="flex items-center py-2 pl-4 pr-2">{participant.name}</div>
                        {/* <div className="flex">
                          {participant.votes
                            ?.sort(
                              (a, b) => a.appointment.date.getTime() - b.appointment.date.getTime(),
                            )
                            .map((vote) => (
                              <div key={vote.id} className="flex space-x-1">
                                {vote.appointment?.times?.length > 0 ? (
                                  <div>
                                    {vote.appointment.times.map((time) => (
                                      <>
                                        <div>{`${time.start?.toISOString()} - ${time.end?.toISOString()}`}</div>
                                        <div>{vote.answer}</div>
                                      </>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div>{vote.appointment?.date.toISOString()}</div>
                                    <div>{vote.answer}</div>
                                  </>
                                )}
                              </div>
                            ))}
                        </div> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div key={meeting.id} className="border border-gray-800">
              <div>
                <p>{meeting.title}</p>
                <p>{meeting.description}</p>
                <p>{meeting.deadline?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
