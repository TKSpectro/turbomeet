import type { Appointment } from '@prisma/client';
import { Answer } from '@prisma/client';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  MinusCircledIcon,
  PersonIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import type { RouterOutputs } from '../../utils/trpc';
import DateCard from '../meeting/date-card';
import { Button, Loading } from '../ui';

dayjs.extend(relativeTime);

type Props = {
  adminView: boolean;
  meeting: RouterOutputs['meeting']['getOne'] | null | undefined;
  isLoading: boolean;
};

const allowedAnswers = [
  {
    name: 'Yes',
    icon: CheckCircledIcon,
    iconClassName: 'text-green-500',
  },
  {
    name: 'If needed',
    icon: MinusCircledIcon,
    iconClassName: 'text-yellow-500',
  },
  {
    name: 'No',
    icon: CrossCircledIcon,
    iconClassName: 'text-red-500',
  },
];

const AnswerIcon = ({ answer }: { answer?: string }) => {
  if (answer === Answer.YES) {
    return <CheckCircledIcon className="h-5 w-5 text-green-500" />;
  }
  if (answer === Answer.IFNECESSARY) {
    return <MinusCircledIcon className="h-5 w-5 text-yellow-500" />;
  }
  if (answer === Answer.NO) {
    return <CrossCircledIcon className="h-5 w-5 text-red-500" />;
  }

  return <QuestionMarkCircledIcon className="h-5 w-5 text-gray-500" />;
};

export function MeetingDetailPage({ adminView, meeting, isLoading }: Props) {
  const [, copyToClipboard] = useCopyToClipboard();

  // columnWidth used for the participant/voting-table
  const barWidth = '200px';
  const columnWidth = '80px';

  let meetingUrl = '';
  if (typeof window !== 'undefined') {
    meetingUrl = `${window.location.origin}/meeting/${meeting?.id}` || '';
  }

  const [didCopy, setDidCopy] = useState(false);

  const handleHide = () => {
    console.error('Hide not implemented yet.');
  };

  const sortedAppointments: (Appointment & {
    votes: { [Answer.YES]: number; [Answer.NO]: number; [Answer.IFNECESSARY]: number };
  })[] =
    meeting?.appointments
      .sort((a, b) => {
        const start = new Date(a.value.split('/')[0] || '');
        const startB = new Date(b.value.split('/')[0] || '');
        return start.getTime() - startB.getTime();
      })
      .map((a) => ({
        ...a,
        votes: { [Answer.YES]: 0, [Answer.NO]: 0, [Answer.IFNECESSARY]: 0 },
      })) || [];

  const indexCache = new Map<string, number>();

  meeting?.participants.forEach((participant) => {
    participant.votes.forEach((vote) => {
      let index = indexCache.get(vote.appointmentId);
      if (!index) {
        index = sortedAppointments.findIndex((a) => a.id === vote.appointmentId);
        indexCache.set(vote.appointmentId, index);
      }

      if (sortedAppointments[index]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sortedAppointments[index]!.votes[vote.answer] += 1;
      }
    });
  });

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
                <div className="mb-2 text-3xl font-semibold text-slate-100">{meeting.title}</div>
                <div className="mb-2 text-slate-300">
                  by {meeting.ownerUsername} • {dayjs(meeting.createdAt).fromNow()}
                </div>
                <div className="text-slate-100">{meeting.description}</div>
                <div>
                  Possible answers
                  <div className="flex">
                    {allowedAnswers.map((answer) => {
                      return (
                        <div key={answer.name}>
                          <div className="flex items-center py-2 pl-4 pr-2">
                            {answer.icon && <answer.icon className={answer.iconClassName} />}
                            <p className="ml-1">{answer.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4 p-4">
              <div className="flex py-2 pl-4 pr-2 font-medium" style={{ marginLeft: barWidth }}>
                {sortedAppointments.map((appointment) => {
                  const start = new Date(appointment.value.split('/')[0] || '');
                  const end = new Date(appointment.value.split('/')[1] || '');
                  return (
                    <div
                      key={appointment.id}
                      className="shrink-0 space-y-3 py-3 text-center"
                      style={{ width: columnWidth }}
                    >
                      {/* TODO: Replace this with a better card */}
                      <DateCard date={start} />
                      <div>
                        <div className="relative -mr-2 inline-block pr-2 text-right text-xs font-semibold after:absolute after:top-2 after:right-0 after:h-4 after:w-1 after:border-t after:border-r after:border-b after:border-slate-300 after:content-['']">
                          <div>{start.toLocaleTimeString()}</div>
                          <div className="text-slate-400">{end.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex shrink-0 items-center py-2 pl-4 pr-2 font-medium">
                <div className="flex h-full self-end" style={{ width: barWidth }}>
                  {meeting.participants?.length} participant
                  {meeting.participants?.length > 1 && 's'}
                </div>
                <div className="flex">
                  {sortedAppointments?.map((appointment) => {
                    return (
                      <div
                        key={appointment.id}
                        className="flex justify-center"
                        style={{ width: columnWidth }}
                      >
                        <div className="flex items-center justify-center rounded-full bg-slate-500/10 py-1 px-2">
                          <PersonIcon className="h-6 w-6 text-slate-500" />
                          <div className="text-slate-500">{appointment.votes[Answer.YES]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="shrink-0 items-center py-2 pl-4 pr-2 font-medium">
                {meeting.participants.map((participant) => {
                  return (
                    <div key={participant.id} className="flex py-3">
                      <div style={{ width: barWidth }}>{participant.name}</div>
                      {participant.votes
                        .sort((a, b) => {
                          const aAppIndex = sortedAppointments.findIndex(
                            (app) => app.id === a.appointmentId,
                          );
                          const bAppIndex = sortedAppointments.findIndex(
                            (app) => app.id === b.appointmentId,
                          );

                          return aAppIndex - bAppIndex;
                        })
                        .map((vote) => {
                          return (
                            <div
                              key={vote.id}
                              className="flex justify-center"
                              style={{ width: columnWidth }}
                            >
                              <AnswerIcon answer={vote.answer} />
                            </div>
                          );
                        })}
                      {participant.votes.length === 0 &&
                        [...Array(meeting.appointments.length)].map((_, i) => (
                          <div
                            key={i}
                            className="flex justify-center"
                            style={{ width: columnWidth }}
                          >
                            <AnswerIcon />
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
