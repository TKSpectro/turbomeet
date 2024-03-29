import type { Appointment } from '@prisma/client';
import { Answer } from '@prisma/client';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  GearIcon,
  InfoCircledIcon,
  LockClosedIcon,
  LockOpen1Icon,
  MinusCircledIcon,
  PaperPlaneIcon,
  PersonIcon,
  QuestionMarkCircledIcon,
  Share1Icon,
} from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { z } from 'zod';
import type { RouterOutputs } from '../../utils/trpc';
import { trpc } from '../../utils/trpc';
import DateCardDetails from '../meeting/date-card-details';
import { PublicSwitch } from '../meeting/public-switch';
import { Button, Input, Loading } from '../ui';
import { Form, useZodForm } from '../ui/form';
import { TextArea } from '../ui/textarea';

dayjs.extend(relativeTime);

type Props = {
  adminView: boolean;
  user: RouterOutputs['user']['me'] | null | undefined;
  meeting: RouterOutputs['meeting']['getOne'] | null | undefined;
  isLoading: boolean;
  isLoadingUser: boolean;
  refetchMeeting: () => Promise<unknown>;
};

const allowedAnswers = [
  {
    name: 'Yes',
    icon: CheckCircledIcon,
    iconClassName: 'text-success',
  },
  {
    name: 'If needed',
    icon: MinusCircledIcon,
    iconClassName: 'text-warning',
  },
  {
    name: 'No',
    icon: CrossCircledIcon,
    iconClassName: 'text-danger',
  },
];

const AnswerIcon = ({ answer }: { answer?: string }) => {
  if (answer === Answer.YES) {
    return <CheckCircledIcon className="h-5 w-5 text-success" />;
  }
  if (answer === Answer.IFNECESSARY) {
    return <MinusCircledIcon className="h-5 w-5 text-warning" />;
  }
  if (answer === Answer.NO) {
    return <CrossCircledIcon className="h-5 w-5 text-danger" />;
  }

  return <QuestionMarkCircledIcon className="h-5 w-5 text-gray-500" />;
};

const NotVerifiedTooltip = () => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button>
            <InfoCircledIcon className="h-6 w-6" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none text-gray-900 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] dark:bg-gray-900 dark:text-white"
            sideOffset={5}
          >
            This user&apos;s email is not verified
            <Tooltip.Arrow className="fill-white dark:fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export function MeetingDetailPage({
  adminView,
  meeting,
  user: currentUser,
  isLoading,
  isLoadingUser,
  refetchMeeting,
}: Props) {
  const [, copyToClipboard] = useCopyToClipboard();

  // columnWidth used for the participant/voting-table
  const barWidth = '200px';
  const columnWidth = '80px';

  let meetingUrl = '';
  if (typeof window !== 'undefined') {
    meetingUrl = `${window.location.origin}/meeting/${meeting?.id}` || '';
  }

  const [didCopy, setDidCopy] = useState(false);
  const [showShare, setShowShare] = useState(true);

  const sortedAppointments: (Appointment & {
    votes: { [Answer.YES]: number; [Answer.NO]: number; [Answer.IFNECESSARY]: number };
  })[] =
    meeting?.appointments
      .sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
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

  const [participantText, setParticipantText] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const meetingForm = useZodForm({
    schema: z.object({
      participants: z
        .string()
        .email({ message: 'Every comma separated text must be an email' })
        .array()
        .optional(),
    }),
    defaultValues: {},
  });

  const newUserForm = useZodForm({
    schema: z.object({
      email: z.string().email({ message: 'Must be a valid email' }),
    }),
    mode: 'all',
  });

  const { mutate: saveVotes, isLoading: saveVotesLoading } = trpc.meeting.vote.useMutation({
    onSuccess: () => {
      refetchMeeting();
      setVotes({});
    },
  });

  const { mutate: savePublicVotes, isLoading: savePublicVotesLoading } =
    trpc.meetingPublic.vote.useMutation({
      onSuccess: () => {
        refetchMeeting();
        setVotes({});
      },
    });

  const { mutate: updateMeeting } = trpc.meeting.update.useMutation({
    onSuccess: () => refetchMeeting(),
  });

  const [votes, setVotes] = useState<{ [appointmentId: string]: Answer }>({});

  const [isPublic, setIsPublic] = useState<boolean>(meeting?.public || false);

  const VoteButton = ({
    vote,
    disabled,
  }: {
    vote: { appointmentId: string; answer: Answer | undefined };
    disabled: boolean;
  }) => {
    return (
      <div
        className="flex h-8 justify-center self-center"
        style={{ width: columnWidth, minWidth: columnWidth }}
      >
        <button
          aria-label={`Current Vote ${vote.answer}`}
          className={clsx('rounded-md px-3 py-1', {
            'border border-gray-700 dark:border-gray-300': !disabled,
            'bg-success/10': vote.answer === Answer.YES,
            'bg-warning/10': vote.answer === Answer.IFNECESSARY,
            'bg-danger/10': vote.answer === Answer.NO,
          })}
          disabled={disabled}
          onClick={() => {
            let newAnswer = vote.answer || Answer.NO;
            if (vote.answer === Answer.NO) {
              newAnswer = Answer.YES;
            } else if (vote.answer === Answer.YES) {
              newAnswer = Answer.IFNECESSARY;
            } else if (vote.answer === Answer.IFNECESSARY) {
              newAnswer = Answer.NO;
            }
            setVotes((prev) => ({
              ...prev,
              [vote.appointmentId]: newAnswer as Answer,
            }));
          }}
        >
          <AnswerIcon answer={vote.answer} />
        </button>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>turbomeet | Meeting</title>
        <meta name="description" content="turbomeet | Meeting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-full px-8 pt-4 md:w-[1024px] lg:min-h-[calc(100vh-64px)]">
        {isLoading && <Loading width={200} height={200} />}

        {meeting && (
          <div>
            {adminView && showShare && (
              <div className="card p-4">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    Share via link
                  </div>
                  <button
                    onClick={() => {
                      setShowShare(false);
                    }}
                    className="h-8 items-center justify-center rounded-md px-3 text-gray-600 hover:bg-gray-500/10 hover:text-gray-500 active:bg-gray-500/20 dark:text-gray-400"
                  >
                    Hide
                  </button>
                </div>
                <div className="mb-2 text-gray-900 dark:text-gray-100">
                  This link can be given to other invited participants to allow them to vote for an
                  appointment. If the meeting is marked as public anybody can vote with this link.
                </div>
                <div className="relative">
                  <input
                    aria-label="Shareable Meeting URL"
                    readOnly
                    className="mb-4 w-full rounded-md bg-gray-200 p-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 md:mb-0 md:p-3 md:text-lg"
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

            {!adminView && !isLoadingUser && !currentUser && (
              <div className="card p-0">
                <div className="flex items-center justify-start gap-x-2 rounded-md bg-yellow-50 p-4 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-50">
                  <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
                  <span>
                    You are currently visiting a public meeting without being logged in. To vote you
                    can either login or enter your email address below and vote.
                  </span>
                </div>
              </div>
            )}

            <div className="card mt-4 p-4">
              <div>
                <div className="mb-2 flex justify-between text-gray-900 dark:text-gray-100">
                  <div className="text-2xl font-semibold">{meeting.title}</div>
                  {!adminView && meeting.ownerId === currentUser?.id && (
                    <Link
                      href={`/admin/${meeting.id}`}
                      className="flex items-center justify-center rounded-md bg-primary px-2 py-1 font-medium text-gray-900 hover:bg-primary/80 disabled:cursor-not-allowed dark:text-white"
                    >
                      <GearIcon className="mr-2 h-5 w-5" />
                      Manage
                    </Link>
                  )}
                  {adminView && (
                    <div className="flex">
                      <Button
                        small
                        className="mb-4 mr-2 flex"
                        onClick={() => {
                          setShowShare((prev) => !prev);
                        }}
                      >
                        <Share1Icon className="mr-2 h-5 w-5" />
                        Share
                      </Button>

                      <Button
                        small
                        className="mb-4 flex"
                        onClick={() => {
                          updateMeeting({ id: meeting.id, data: { closed: !meeting.closed } });
                        }}
                      >
                        {meeting.closed ? (
                          <>
                            <LockOpen1Icon className="mr-2 h-5 w-5" />
                            Unlock
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="mr-2 h-5 w-5" />
                            Lock
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mb-2 text-gray-700 dark:text-gray-300">
                  by {meeting.ownerUsername} • {dayjs(meeting.createdAt).fromNow()}
                </div>
                {meeting.description && (
                  <div className="mb-2 text-gray-800 dark:text-gray-200">{meeting.description}</div>
                )}

                {adminView && (
                  <PublicSwitch
                    checked={isPublic}
                    onCheckedChange={(checked) => {
                      setIsPublic(checked);

                      updateMeeting({
                        id: meeting.id,
                        data: { public: checked },
                      });
                    }}
                    className="mb-2"
                  />
                )}

                {meeting.deadline && (
                  <div
                    className={clsx('mb-2 text-gray-900 dark:text-gray-100', {
                      'text-danger dark:text-danger': dayjs().isAfter(meeting.deadline),
                    })}
                  >
                    Deadline: {meeting.deadline?.toLocaleDateString()}
                  </div>
                )}
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
                {adminView && (
                  <Form
                    form={meetingForm}
                    onSubmit={() => {
                      updateMeeting({
                        id: meeting.id,
                        data: {
                          participants: participants,
                        },
                      });
                      setParticipantText('');
                    }}
                  >
                    <div className="flex">
                      <TextArea
                        id="participants-textarea"
                        error={meetingForm.formState.errors.participants?.message}
                        onChange={(e) => {
                          setParticipantText(e.target.value);
                          const newValue = e.target.value?.split(',').map((p) => p.trim()) || [];
                          const schema = z.string().email().array().optional();
                          if (!schema.safeParse(newValue).success) {
                            meetingForm.setError('participants', {
                              message: 'Contains invalid email(s)',
                            });
                          } else {
                            meetingForm.clearErrors('participants');
                          }
                          setParticipants(newValue);
                        }}
                        fullWidth={false}
                        placeholder="Invite more participants. Add emails separated by commas"
                        value={participantText}
                      />
                      <div className="ml-4 self-center">
                        <Button type="submit" className="flex" small>
                          <PaperPlaneIcon className="mr-3 h-5 w-5" />
                          Invite
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </div>
            </div>

            {(meeting.closed || (meeting.deadline && dayjs().isAfter(meeting.deadline))) && (
              <div className="card mt-4 p-4">
                <div className="mb-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  Results
                </div>
                <div className="flex">
                  {sortedAppointments
                    .sort((a, b) => {
                      if (a.votes[Answer.YES] === b.votes[Answer.YES]) {
                        if (a.votes[Answer.IFNECESSARY] === b.votes[Answer.IFNECESSARY]) {
                          return a.votes[Answer.NO] - b.votes[Answer.NO];
                        }

                        return b.votes[Answer.IFNECESSARY] - a.votes[Answer.IFNECESSARY];
                      }
                      return b.votes[Answer.YES] - a.votes[Answer.YES];
                    })
                    .slice(0, 5)
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="shrink-0 space-y-3 py-3 text-center"
                        style={{ width: columnWidth }}
                      >
                        <DateCardDetails
                          start={appointment.start}
                          end={appointment.end ?? undefined}
                        />
                        {Object.values(Answer).map((answer, i) => {
                          return (
                            <div key={i} className="flex items-center justify-around px-4">
                              <AnswerIcon answer={answer} />
                              {appointment.votes[answer]}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="card mt-4 overflow-x-auto p-4">
              <div className="flex py-2 pl-4 pr-2 font-medium" style={{ marginLeft: barWidth }}>
                {sortedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="shrink-0 space-y-3 py-3 text-center"
                    style={{ width: columnWidth }}
                  >
                    <DateCardDetails start={appointment.start} end={appointment.end ?? undefined} />
                  </div>
                ))}
              </div>
              <div className="flex items-center py-2 pl-4 pr-2 font-medium">
                <div className="flex h-full shrink-0 self-end" style={{ width: barWidth }}>
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
                        <div className="flex items-center justify-center rounded-full bg-gray-500/10 py-1 px-2">
                          <PersonIcon className="h-6 w-6 text-gray-500" />
                          <div className="text-gray-500">{appointment.votes[Answer.YES]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="items-center py-2 pl-4 pr-2 font-medium">
                {meeting.participants.map((participant) => {
                  const isDisabled =
                    meeting.closed ||
                    (meeting.deadline && dayjs().isAfter(meeting.deadline)) ||
                    false ||
                    participant.id !== currentUser?.id;

                  return (
                    <div key={participant.id} className="flex py-3">
                      <div className="flex shrink-0 items-center" style={{ width: barWidth }}>
                        <p className="mr-1 truncate">{participant.name || participant.email}</p>
                        {!participant.emailVerified && <NotVerifiedTooltip />}
                      </div>
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
                        .map((vote, i) => {
                          // If the user has changed their answer we show that instead
                          if (
                            participant.id === currentUser?.id &&
                            votes[vote.appointmentId] !== undefined
                          ) {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            vote.answer = votes[vote.appointmentId]!;
                          }

                          return <VoteButton key={i} vote={vote} disabled={isDisabled} />;
                        })}
                      {participant.votes.length === 0 &&
                        sortedAppointments.map((appointment, i) => {
                          let vote: { appointmentId: string; answer: Answer | undefined };
                          if (
                            participant.id === currentUser?.id &&
                            votes[appointment.id] !== undefined
                          ) {
                            vote = {
                              appointmentId: appointment.id,
                              answer: votes[appointment.id] as Answer,
                            };
                          } else {
                            vote = {
                              appointmentId: appointment.id,
                              answer: undefined,
                            };
                          }

                          return <VoteButton key={i} vote={vote} disabled={isDisabled} />;
                        })}
                    </div>
                  );
                })}
                {!currentUser && !isLoadingUser && (
                  <div className="flex py-3">
                    <div className="shrink-0" style={{ width: barWidth }}>
                      <Form form={newUserForm} onSubmit={() => null}>
                        <Input type="email" label="Your email" {...newUserForm.register('email')} />
                      </Form>
                    </div>
                    {sortedAppointments.map((appointment, i) => {
                      let vote: { appointmentId: string; answer: Answer | undefined };
                      if (votes[appointment.id] !== undefined) {
                        vote = {
                          appointmentId: appointment.id,
                          answer: votes[appointment.id] as Answer,
                        };
                      } else {
                        vote = {
                          appointmentId: appointment.id,
                          answer: undefined,
                        };
                      }

                      return (
                        <VoteButton
                          key={i}
                          vote={vote}
                          disabled={
                            meeting.closed ||
                            (meeting.deadline && dayjs().isAfter(meeting.deadline)) ||
                            false
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <Button
                hidden={
                  meeting.closed || (meeting.deadline && dayjs().isAfter(meeting.deadline)) || false
                }
                disabled={
                  savePublicVotesLoading ||
                  saveVotesLoading ||
                  Object.keys(votes).length === 0 ||
                  (!currentUser && !newUserForm.formState.isValid)
                }
                onClick={() => {
                  const mappedVotes = Object.entries(votes).map(([appointmentId, answer]) => ({
                    appointmentId,
                    answer,
                  }));

                  if (currentUser) {
                    saveVotes({
                      meetingId: meeting.id,
                      votes: mappedVotes,
                    });
                  } else {
                    savePublicVotes({
                      meetingId: meeting.id,
                      votes: mappedVotes,
                      email: newUserForm.getValues().email,
                    });
                  }
                }}
              >
                Save Votes
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
