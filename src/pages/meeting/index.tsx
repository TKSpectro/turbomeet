import dayjs from 'dayjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import AppointmentDropdown from '../../components/meeting/appointment-dropdown';
import DateCard from '../../components/meeting/date-card';
import { Switch } from '../../components/ui';
import { Button } from '../../components/ui/button';
import { Form, useZodForm } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { zMeetingCreateInput } from '../../types/zod-meeting';
import { trpc } from '../../utils/trpc';

export const getDateProps = (date: Date) => {
  const d = dayjs(date);
  return {
    day: d.format('D'),
    dow: d.format('ddd'),
    month: d.format('MMM'),
  };
};

const Dashboard: NextPage = () => {
  const router = useRouter();

  const { mutate: createMeeting, error } = trpc.meeting.create.useMutation({
    onSuccess: (data) => {
      router.push(`/meeting/${data.id}`);
    },
  });

  const meetingForm = useZodForm({
    schema: zMeetingCreateInput,
    defaultValues: {
      appointments: [],
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

  const [appointments, setAppointments] = useState<
    { date: Date; times: { start: Date; end: Date }[] }[]
  >([]);

  const [enableSpecificTimes, setEnableSpecificTimes] = useState(false);

  const removeAppointment = (dateIndex: number) => {
    setAppointments((oldDates) => {
      return oldDates.filter((_, i) => i !== dateIndex);
    });
  };

  const addAppointmentTime = (dateIndex: number) => {
    setAppointments((oldDates) => {
      return oldDates.map((oldDate, i) => {
        if (i === dateIndex) {
          const newStartTime = new Date();
          newStartTime.setHours(12);
          newStartTime.setMinutes(0);

          const newEndTime = new Date();
          newEndTime.setHours(12);
          newEndTime.setMinutes(30);

          return {
            ...oldDate,
            times: [...oldDate.times, { start: newStartTime, end: newEndTime }],
          };
        }
        return oldDate;
      });
    });
  };

  const updateAppointmentTime = (
    dateIndex: number,
    timeIndex: number,
    newDate: Date | null,
    isStart: boolean,
  ) => {
    const timeKey = isStart ? 'start' : 'end';

    setAppointments((oldDates) => {
      return oldDates.map((oldDate, i) => {
        if (i === dateIndex) {
          return {
            ...oldDate,
            times: oldDate.times.map((oldTime, j) => {
              if (j === timeIndex) {
                oldTime[timeKey].setHours(newDate?.getHours() || 12);
                oldTime[timeKey].setMinutes(
                  (newDate?.getMinutes() || 0) + new Date().getTimezoneOffset(),
                );
                return {
                  ...oldTime,
                  [timeKey]: oldTime[timeKey],
                };
              }
              return oldTime;
            }),
          };
        }
        return oldDate;
      });
    });
  };

  const removeAppointmentTime = (dateIndex: number, timeIndex: number) => {
    setAppointments((oldDates) => {
      return oldDates.map((oldDate, i) => {
        if (i === dateIndex) {
          return {
            ...oldDate,
            times: oldDate.times.filter((_, j) => j !== timeIndex),
          };
        }
        return oldDate;
      });
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
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          New Meeting
        </h1>

        <Form
          form={meetingForm}
          onSubmit={() => {
            createMeeting({
              title: meetingForm.getValues('title'),
              description: meetingForm.getValues('description'),
              deadline: meetingForm.getValues('deadline'),
              appointments: enableSpecificTimes
                ? appointments
                : appointments.map((a) => {
                    return { date: a.date, times: [] };
                  }),
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

            <Button onClick={stepForward}>Continue</Button>
          </div>

          <div className={step === 1 ? '' : 'hidden'}>
            <Input
              type={'date'}
              label="Date"
              onChange={(e) => {
                setAppointments((oldDates) => {
                  return [
                    ...oldDates,
                    {
                      date: e.target.valueAsDate || new Date(),
                      times: [{ start: new Date(), end: new Date() }],
                    },
                  ];
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
                      isLeft={enableSpecificTimes}
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
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((date, index) => {
                        return (
                          <div
                            key={index}
                            className="space-y-3 py-4 sm:flex sm:space-y-0 sm:space-x-4"
                          >
                            <div>
                              <DateCard {...getDateProps(date.date)} />
                            </div>

                            <div className="grow space-y-3">
                              {date.times.map((time, timeIndex) => {
                                return (
                                  <div key={timeIndex} className="flex items-center space-x-3">
                                    <Input
                                      type={'time'}
                                      value={`${
                                        time.start.getHours() < 10 ? '0' : ''
                                      }${time.start.getHours()}:${
                                        time.start.getMinutes() < 10 ? '0' : ''
                                      }${time.start.getMinutes()}`}
                                      onChange={(e) => {
                                        updateAppointmentTime(
                                          index,
                                          timeIndex,
                                          e.target.valueAsDate,
                                          true,
                                        );
                                      }}
                                      disableLabel
                                    />
                                    <Input
                                      type={'time'}
                                      value={`${
                                        time.end.getHours() < 10 ? '0' : ''
                                      }${time.end.getHours()}:${
                                        time.end.getMinutes() < 10 ? '0' : ''
                                      }${time.end.getMinutes()}`}
                                      onChange={(e) => {
                                        updateAppointmentTime(
                                          index,
                                          timeIndex,
                                          e.target.valueAsDate,
                                          false,
                                        );
                                      }}
                                      disableLabel
                                    />
                                    <Button
                                      onClick={() => {
                                        removeAppointmentTime(index, timeIndex);
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
                                    addAppointmentTime(index);
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
                ) : appointments.length ? (
                  <div className="grid grid-cols-[repeat(auto-fill,60px)] gap-5 py-4">
                    {appointments
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((appointment, i) => {
                        return (
                          <DateCard
                            key={i}
                            {...getDateProps(appointment.date)}
                            annotation={
                              <button
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 "
                                type="button"
                                onClick={() => {
                                  removeAppointment(i);
                                }}
                              >
                                <HiOutlineX className="h-3 w-3" />
                              </button>
                            }
                          />
                        );
                      })}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center py-12">
                    <div className="text-center font-medium text-gray-400 dark:text-gray-100">
                      <div>{'Please select the first appointment date'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
        </Form>

        {error && JSON.stringify(error, null, 2)}
      </main>
    </>
  );
};

export default Dashboard;
