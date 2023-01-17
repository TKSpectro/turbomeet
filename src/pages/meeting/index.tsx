import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Switch } from '../../components/ui';
import { Button } from '../../components/ui/button';
import { Form, useZodForm } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { zMeetingCreateInput } from '../../types/zod-meeting';
import { trpc } from '../../utils/trpc';

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
            console.log('submit');

            createMeeting({
              title: meetingForm.getValues('title'),
              description: meetingForm.getValues('description'),
              deadline: meetingForm.getValues('deadline'),
              appointments,
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

            <div>
              <label className="text-gray-700">Enable specific times</label>
              <Switch
                isLeft={enableSpecificTimes}
                onClick={() => {
                  setEnableSpecificTimes((oldValue) => !oldValue);
                }}
              />
            </div>

            {appointments.map((date, index) => {
              return (
                <div key={index}>
                  <p
                    className="rounded-md border border-gray-700"
                    onClick={() => {
                      setAppointments((oldDates) => {
                        return oldDates.filter((_, i) => i !== index);
                      });
                    }}
                  >
                    {date.date.toDateString()}
                  </p>

                  {enableSpecificTimes && (
                    <div>
                      {date.times.map((time, timeIndex) => {
                        return (
                          <div key={timeIndex} className="flex">
                            <Input
                              type={'time'}
                              value={`${time.start.getHours()}:${
                                time.start.getMinutes() < 10 ? '0' : ''
                              }${time.start.getMinutes()}`}
                              onChange={(e) => {
                                setAppointments((oldDates) => {
                                  return oldDates.map((oldDate, i) => {
                                    if (i === index) {
                                      return {
                                        ...oldDate,
                                        times: oldDate.times.map((oldTime, j) => {
                                          if (j === timeIndex) {
                                            oldTime.start.setHours(
                                              e.target.valueAsDate?.getHours() || 12,
                                            );
                                            oldTime.start.setMinutes(
                                              (e.target.valueAsDate?.getMinutes() || 0) +
                                                new Date().getTimezoneOffset(),
                                            );
                                            return {
                                              ...oldTime,
                                              start: oldTime.start,
                                            };
                                          }
                                          return oldTime;
                                        }),
                                      };
                                    }
                                    return oldDate;
                                  });
                                });
                              }}
                            />
                            <Input
                              type={'time'}
                              value={`${time.end.getHours()}:${
                                time.end.getMinutes() < 10 ? '0' : ''
                              }${time.end.getMinutes()}`}
                              onChange={(e) => {
                                setAppointments((oldDates) => {
                                  return oldDates.map((oldDate, i) => {
                                    if (i === index) {
                                      return {
                                        ...oldDate,
                                        times: oldDate.times.map((oldTime, j) => {
                                          if (j === timeIndex) {
                                            oldTime.end.setHours(
                                              e.target.valueAsDate?.getHours() || 12,
                                            );
                                            oldTime.end.setMinutes(
                                              (e.target.valueAsDate?.getMinutes() || 0) +
                                                new Date().getTimezoneOffset(),
                                            );
                                            return {
                                              ...oldTime,
                                              end: oldTime.end,
                                            };
                                          }
                                          return oldTime;
                                        }),
                                      };
                                    }
                                    return oldDate;
                                  });
                                });
                              }}
                            />
                            <Button
                              onClick={() => {
                                setAppointments((oldDates) => {
                                  return oldDates.map((oldDate, i) => {
                                    if (i === index) {
                                      return {
                                        ...oldDate,
                                        times: oldDate.times.filter((_, j) => j !== timeIndex),
                                      };
                                    }
                                    return oldDate;
                                  });
                                });
                              }}
                            >
                              x
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        onClick={() => {
                          setAppointments((oldDates) => {
                            return oldDates.map((oldDate, i) => {
                              if (i === index) {
                                const newStartTime = new Date();
                                newStartTime.setHours(12);
                                newStartTime.setMinutes(0);

                                const newEndTime = new Date();
                                newEndTime.setHours(12);
                                newEndTime.setMinutes(30);

                                return {
                                  ...oldDate,
                                  times: [
                                    ...oldDate.times,
                                    { start: newStartTime, end: newEndTime },
                                  ],
                                };
                              }
                              return oldDate;
                            });
                          });
                        }}
                      >
                        Add time option
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            <Button onClick={stepBackward}>Back</Button>
            <Button
              type="submit"
              onClick={() => {
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
