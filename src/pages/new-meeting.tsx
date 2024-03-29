import clsx from 'clsx';
import { DateTime } from 'luxon';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { z } from 'zod';
import AppointmentDropdown from '../components/meeting/appointment-dropdown';
import DateCard from '../components/meeting/date-card';
import { PublicSwitch } from '../components/meeting/public-switch';
import { Switch } from '../components/ui';
import { Button } from '../components/ui/button';
import { Form, useZodForm } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { TextArea } from '../components/ui/textarea';
import { zMeetingCreateInput } from '../types/zod-meeting';
import { trpc } from '../utils/trpc';

const NewMeeting: NextPage = () => {
  const router = useRouter();

  const { mutate: createMeeting, error } = trpc.meeting.create.useMutation({
    onSuccess: (data) => {
      router.push(`/admin/${data.id}`);
    },
  });

  const meetingForm = useZodForm({
    schema: zMeetingCreateInput,
    defaultValues: {
      public: false,
      appointments: [],
      participants: [],
    },
  });

  const [step, setStep] = useState(0);
  const stepForward = () => {
    setStep((oldStep) => {
      return ++oldStep;
    });
  };

  const stepBackward = () => {
    setStep((oldStep) => {
      return --oldStep;
    });
  };

  const [participants, setParticipants] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<{ start: Date; end?: Date }[]>([]);

  const [enableSpecificTimes, setEnableSpecificTimes] = useState(false);

  const removeAppointment = (dateIndex: number) => {
    setAppointments((oldDates) => {
      return oldDates.filter((_, i) => i !== dateIndex);
    });
  };

  const addAppointmentTime = (start: Date, end?: Date) => {
    setAppointments((oldDates) => {
      start.setHours(8);
      start.setMinutes(0);

      end = end ?? DateTime.fromJSDate(start).plus({ hours: 1, minutes: 30 }).toJSDate();

      return [...oldDates, { start, end }];
    });
  };

  const updateAppointmentTime = (dateIndex: number, newDate: Date | null, isStart: boolean) => {
    setAppointments((oldDates) => {
      return oldDates.map((oldDate, i) => {
        if (i === dateIndex) {
          const start = oldDate.start;
          const end =
            oldDate.end ?? DateTime.fromJSDate(start).plus({ hours: 1, minutes: 30 }).toJSDate();

          if (isStart) {
            start.setHours(newDate?.getHours() || 8);
            start.setMinutes((newDate?.getMinutes() || 0) + new Date().getTimezoneOffset());
          } else {
            end.setHours(newDate?.getHours() || 9);
            end.setMinutes((newDate?.getMinutes() || 30) + new Date().getTimezoneOffset());
          }

          return { start, end };
        }
        return oldDate;
      });
    });
  };

  const removeAppointmentTime = (dateIndex: number) => {
    setAppointments((oldDates) => {
      return oldDates.filter((_, i) => i !== dateIndex);
    });
  };

  return (
    <>
      <Head>
        <title>turbomeet | Meeting</title>
        <meta name="description" content="turbomeet | Meeting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-800 dark:text-gray-200 md:text-[5rem]">
          New Meeting
        </h1>

        <Form
          form={meetingForm}
          onSubmit={() => {
            createMeeting({
              title: meetingForm.getValues('title'),
              description: meetingForm.getValues('description'),
              deadline: meetingForm.getValues('deadline'),
              public: meetingForm.getValues('public'),
              appointments: appointments.map((date) => {
                if (enableSpecificTimes) {
                  return date;
                } else {
                  // If specific times are disabled, force end to be not set
                  return { start: date.start };
                }
              }),
              participants: participants,
            });
          }}
        >
          <div className={step === 0 ? '' : 'hidden'}>
            <Input
              label="Title"
              {...meetingForm.register('title')}
              placeholder="Sprint Meeting 1"
            />
            <Input label="Description" {...meetingForm.register('description')} />
            <Input
              label="Deadline"
              type="datetime-local"
              {...meetingForm.register('deadline', { value: null, valueAsDate: true })}
            />

            <PublicSwitch
              isForm
              checked={meetingForm.watch('public')}
              onCheckedChange={(checked) => {
                meetingForm.setValue('public', checked);
              }}
            />

            <TextArea
              label="Participants"
              error={meetingForm.formState.errors.participants?.message}
              placeholder="Invite more participants. Add emails separated by commas"
              onChange={(e) => {
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
            />

            <Button onClick={stepForward}>Continue</Button>
          </div>

          <div className={step === 1 ? '' : 'hidden'}>
            <Input
              id="date"
              type={'date'}
              label="Date"
              onChange={(e) => {
                setAppointments((oldDates) => {
                  const start = e.target.valueAsDate || new Date();

                  // If specific times are disabled, force the time to be 08am, so if the user toggles specific times on, the time will not be 01am
                  start.setHours(8);
                  start.setMinutes(0);

                  const end = DateTime.fromJSDate(start).plus({ hours: 1, minutes: 30 }).toJSDate();

                  return [...oldDates, { start, end }];
                });
              }}
            />
            <div className="flex grow flex-col">
              <div className="border-b">
                <div className="flex items-center space-x-3 p-4">
                  <div className="grow">
                    <div className="font-medium">Enable specific times</div>
                    <div className="text-sm">Include start and end times for each appointment</div>
                  </div>
                  <div>
                    <Switch
                      isRight={enableSpecificTimes}
                      onClick={() => {
                        setEnableSpecificTimes((oldValue) => !oldValue);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grow px-4">
                {enableSpecificTimes ? (
                  <div className="divide-y">
                    {appointments
                      .reduce((acc, date, index) => {
                        const start = date.start;
                        const end =
                          date.end ??
                          DateTime.fromJSDate(start).plus({ hours: 1, minutes: 30 }).toJSDate();

                        const shortDate = `${start.toISOString().split('T')[0]}`;

                        const accIndex = acc.findIndex((a) => a.date === shortDate);
                        // Date doesn't exist in array
                        if (accIndex === -1) {
                          acc.push({
                            date: shortDate,
                            times: [{ index, start, end }],
                          });
                        } else {
                          acc[accIndex]?.times.push({ index, start, end });
                        }

                        return [...acc];
                      }, [] as { date: string; times: { index: number; start: Date; end: Date }[] }[])
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((appointment, index) => {
                        return (
                          <div
                            key={index}
                            className="space-y-3 py-4 sm:flex sm:space-y-0 sm:space-x-4"
                          >
                            <div>
                              <DateCard date={new Date(appointment.date)} />
                            </div>

                            <div className="grow space-y-3">
                              {appointment.times.map((time, timeIndex) => {
                                return (
                                  <div key={timeIndex} className="flex items-center space-x-3">
                                    <Input
                                      id="start-time"
                                      type={'time'}
                                      value={`${
                                        time.start.getHours() < 10 ? '0' : ''
                                      }${time.start.getHours()}:${
                                        time.start.getMinutes() < 10 ? '0' : ''
                                      }${time.start.getMinutes()}`}
                                      onChange={(e) => {
                                        updateAppointmentTime(
                                          time.index,
                                          e.target.valueAsDate,
                                          true,
                                        );
                                      }}
                                      disableLabel
                                    />
                                    <Input
                                      id="end-time"
                                      type={'time'}
                                      value={`${
                                        time.end.getHours() < 10 ? '0' : ''
                                      }${time.end.getHours()}:${
                                        time.end.getMinutes() < 10 ? '0' : ''
                                      }${time.end.getMinutes()}`}
                                      onChange={(e) => {
                                        updateAppointmentTime(
                                          time.index,
                                          e.target.valueAsDate,
                                          false,
                                        );
                                      }}
                                      disableLabel
                                    />
                                    <Button
                                      aria-label="Remove time option"
                                      onClick={() => {
                                        removeAppointmentTime(time.index);
                                      }}
                                    >
                                      <HiOutlineX className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                                    </Button>
                                  </div>
                                );
                              })}

                              <div className="flex items-center space-x-3">
                                <Button
                                  onClick={() => {
                                    addAppointmentTime(new Date(appointment.date));
                                  }}
                                >
                                  Add time option
                                </Button>
                                <AppointmentDropdown
                                  removeAppointment={() => {
                                    removeAppointment(index);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div
                    className={clsx('grid grid-cols-[repeat(auto-fill,60px)] gap-5', {
                      'py-4': appointments.length > 0,
                    })}
                  >
                    {appointments
                      .reduce((acc, date, index) => {
                        const start = date.start;
                        const end =
                          date.end ??
                          DateTime.fromJSDate(start).plus({ hours: 1, minutes: 30 }).toJSDate();

                        const shortDate = `${start.toISOString().split('T')[0]}`;

                        const accIndex = acc.findIndex((a) => a.date === shortDate);
                        // Date doesn't exist in array
                        if (accIndex === -1) {
                          acc.push({
                            date: shortDate,
                            times: [{ index, start, end }],
                          });
                        } else {
                          acc[accIndex]?.times.push({ index, start, end });
                        }

                        return [...acc];
                      }, [] as { date: string; times: { index: number; start: Date; end: Date }[] }[])
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((appointment, index) => {
                        return (
                          <DateCard
                            key={index}
                            date={new Date(appointment.date)}
                            annotation={
                              <button
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 "
                                type="button"
                                aria-label="Remove Appointment Date"
                                onClick={() => {
                                  removeAppointment(index);
                                }}
                              >
                                <HiOutlineX className="h-3 w-3" />
                              </button>
                            }
                          />
                        );
                      })}
                  </div>
                )}
                {!appointments.length && (
                  <div className="flex h-full items-center justify-center py-12">
                    <div className="text-center font-medium text-gray-400 dark:text-gray-100">
                      <div>{'Please select the first appointment date'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <Button onClick={stepBackward} className="mr-1">
                Back
              </Button>
              <Button
                type="submit"
                onClick={async () => {
                  // Trigger validation programmatically as it triggers AFTER the submit
                  await meetingForm.trigger();

                  // If there is a other error than the appointments error, a field in the first form page is invalid
                  if (
                    Object.keys(meetingForm.formState.errors).findIndex(
                      (key) => key !== 'appointments',
                    ) !== -1
                  ) {
                    setStep(0);
                    return;
                  }
                }}
              >
                Create Meeting
              </Button>
            </div>
          </div>
        </Form>

        {error && JSON.stringify(error, null, 2)}
      </main>
    </>
  );
};

export default NewMeeting;
