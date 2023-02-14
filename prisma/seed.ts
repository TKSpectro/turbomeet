import { Answer, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  let user = await prisma.user.findFirst({
    where: {
      email: 'user@turbomeet.xyz',
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'user@turbomeet.xyz',
        name: 'Seed User',
      },
    });
  }

  let user2 = await prisma.user.findFirst({
    where: {
      email: 'johndoe@turbomeet.xyz',
    },
  });
  if (!user2) {
    user2 = await prisma.user.create({
      data: {
        email: 'johndoe@turbomeet.xyz',
        name: 'John Doe',
      },
    });
  }

  let user3 = await prisma.user.findFirst({
    where: {
      email: 'janedoe@turbomeet.xyz',
    },
  });
  if (!user3) {
    user3 = await prisma.user.create({
      data: {
        email: 'janedoe@turbomeet.xyz',
        name: 'Jane Doe',
      },
    });
  }

  let meeting = await prisma.meeting.findFirst({
    where: {
      title: 'Seed Meeting',
    },
  });
  if (!meeting) {
    meeting = await prisma.meeting.create({
      data: {
        title: 'Seed Meeting',
        description: 'This is a seeded meeting',
        owner: {
          connect: {
            id: user.id,
          },
        },
        ownerUsername: user.name,
        participants: {
          connect: [{ id: user.id }, { id: user2.id }, { id: user3.id }],
        },
        appointments: {
          createMany: {
            data: [
              { value: '2023-02-07T14:00:00.000Z/2023-02-07T15:30:00.000Z' },
              { value: '2023-02-07T10:00:00.000Z/2023-02-07T11:30:00.000Z' },
              { value: '2023-02-07T08:00:00.000Z/2023-02-07T09:30:00.000Z' },
              { value: '2023-02-06T08:00:00.000Z/2023-02-06T09:30:00.000Z' },
              { value: '2023-02-08T08:00:00.000Z/2023-02-08T09:30:00.000Z' },
              { value: '2023-02-08T12:00:00.000Z/2023-02-08T13:30:00.000Z' },
            ],
          },
        },
      },
    });
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      meetingId: meeting.id,
    },
  });

  const votes = await prisma.vote.count({
    where: {
      meetingId: meeting.id,
    },
  });

  if (votes === 0) {
    for (const appointment of appointments) {
      const rand = Math.random();

      let answerUser1: Answer = Answer.NO;
      let answerUser2: Answer = Answer.NO;
      if (rand < 0.333) {
        answerUser1 = Answer.YES;
        answerUser2 = Answer.NO;
      } else if (rand < 0.666) {
        answerUser1 = Answer.IFNECESSARY;
        answerUser2 = Answer.IFNECESSARY;
      } else {
        answerUser1 = Answer.NO;
        answerUser2 = Answer.YES;
      }

      await prisma.vote.createMany({
        data: [
          {
            appointmentId: appointment.id,
            meetingId: meeting.id,
            userId: user.id,
            answer: answerUser1,
          },
          {
            appointmentId: appointment.id,
            meetingId: meeting.id,
            userId: user2.id,
            answer: answerUser2,
          },
        ],
      });
    }
  }

  let overFlowMeeting = await prisma.meeting.findFirst({
    where: {
      title: 'Seed Overflow Meeting',
    },
  });
  if (!overFlowMeeting) {
    overFlowMeeting = await prisma.meeting.create({
      data: {
        title: 'Seed Overflow Meeting',
        description: 'This is a seeded meeting',
        owner: {
          connect: {
            id: user.id,
          },
        },
        ownerUsername: user.name,
        participants: {
          connect: [{ id: user.id }, { id: user2.id }, { id: user3.id }],
        },
        appointments: {
          createMany: {
            data: [
              { value: '2023-02-17T14:00:00.000Z/2023-02-17T15:30:00.000Z' },
              { value: '2023-02-17T10:00:00.000Z/2023-02-17T11:30:00.000Z' },
              { value: '2023-02-17T08:00:00.000Z/2023-02-17T09:30:00.000Z' },
              { value: '2023-02-16T08:00:00.000Z/2023-02-16T09:30:00.000Z' },
              { value: '2023-02-18T08:00:00.000Z/2023-02-18T09:30:00.000Z' },
              { value: '2023-02-18T12:00:00.000Z/2023-02-18T13:30:00.000Z' },

              { value: '2023-02-19T14:00:00.000Z/2023-02-19T15:30:00.000Z' },
              { value: '2023-02-19T10:00:00.000Z/2023-02-19T11:30:00.000Z' },
              { value: '2023-02-19T08:00:00.000Z/2023-02-19T09:30:00.000Z' },
              { value: '2023-02-14T08:00:00.000Z/2023-02-14T09:30:00.000Z' },
              { value: '2023-02-15T08:00:00.000Z/2023-02-15T09:30:00.000Z' },
              { value: '2023-02-15T12:00:00.000Z/2023-02-15T13:30:00.000Z' },
            ],
          },
        },
      },
    });
  }

  const overflowAppointments = await prisma.appointment.findMany({
    where: {
      meetingId: overFlowMeeting.id,
    },
  });

  const overflowVotes = await prisma.vote.count({
    where: {
      appointment: {
        meetingId: overFlowMeeting.id,
      },
    },
  });

  if (overflowVotes === 0) {
    let i = 0;
    for (const overflowAppointment of overflowAppointments) {
      const rand = Math.random();

      let answerUser1: Answer = Answer.NO;
      let answerUser2: Answer = Answer.NO;
      if (i === 0) {
        answerUser1 = Answer.YES;
        answerUser2 = Answer.YES;
      } else if (i === 1) {
        answerUser1 = Answer.NO;
        answerUser2 = Answer.NO;
      } else if (rand < 0.333) {
        answerUser1 = Answer.YES;
        answerUser2 = Answer.NO;
      } else if (rand < 0.666) {
        answerUser1 = Answer.IFNECESSARY;
        answerUser2 = Answer.IFNECESSARY;
      } else {
        answerUser1 = Answer.NO;
        answerUser2 = Answer.YES;
      }

      await prisma.vote.createMany({
        data: [
          {
            appointmentId: overflowAppointment.id,
            meetingId: overFlowMeeting.id,
            userId: user.id,
            answer: answerUser1,
          },
          {
            appointmentId: overflowAppointment.id,
            meetingId: overFlowMeeting.id,
            userId: user2.id,
            answer: answerUser2,
          },
        ],
      });

      ++i;
    }
  }

  let notVotedMeeting = await prisma.meeting.findFirst({
    where: {
      title: 'Seed Not Voted Meeting',
    },
  });
  if (!notVotedMeeting) {
    notVotedMeeting = await prisma.meeting.create({
      data: {
        title: 'Seed Not Voted Meeting',
        description: 'This is a seeded not voting meeting',
        owner: {
          connect: {
            id: user.id,
          },
        },
        ownerUsername: user.name,
        participants: {
          connect: [{ id: user.id }, { id: user2.id }, { id: user3.id }],
        },
        appointments: {
          createMany: {
            data: [
              { value: '2023-02-07T14:00:00.000Z/2023-02-07T15:30:00.000Z' },
              { value: '2023-02-07T10:00:00.000Z/2023-02-07T11:30:00.000Z' },
              { value: '2023-02-07T08:00:00.000Z/2023-02-07T09:30:00.000Z' },
              { value: '2023-02-06T08:00:00.000Z/2023-02-06T09:30:00.000Z' },
              { value: '2023-02-08T08:00:00.000Z/2023-02-08T09:30:00.000Z' },
              { value: '2023-02-08T12:00:00.000Z/2023-02-08T13:30:00.000Z' },
            ],
          },
        },
      },
    });
  }

  {
    let noSpecificTimeMeeting = await prisma.meeting.findFirst({
      where: {
        title: 'Seed No Specific Times Meeting',
      },
    });
    if (!noSpecificTimeMeeting) {
      noSpecificTimeMeeting = await prisma.meeting.create({
        data: {
          title: 'Seed No Specific Times Meeting',
          description: 'This is a seeded meeting',
          owner: {
            connect: {
              id: user.id,
            },
          },
          ownerUsername: user.name,
          participants: {
            connect: [{ id: user.id }, { id: user2.id }, { id: user3.id }],
          },
          appointments: {
            createMany: {
              data: [
                { value: '2023-02-07T08:00:00.000Z/' },
                { value: '2023-02-06T08:00:00.000Z/' },
                { value: '2023-02-08T08:00:00.000Z' },
                { value: '2023-02-09T08:00:00.000Z' },
                { value: '2023-02-10T08:00:00.000Z' },
              ],
            },
          },
        },
      });
    }

    const noSpecificTimeAppointments = await prisma.appointment.findMany({
      where: {
        meetingId: noSpecificTimeMeeting.id,
      },
    });

    const noSpecificTimeVotes = await prisma.vote.count({
      where: {
        meetingId: noSpecificTimeMeeting.id,
      },
    });

    if (noSpecificTimeVotes === 0) {
      for (const appointment of noSpecificTimeAppointments) {
        const rand = Math.random();

        let answerUser1: Answer = Answer.NO;
        let answerUser2: Answer = Answer.NO;
        if (rand < 0.333) {
          answerUser1 = Answer.YES;
          answerUser2 = Answer.NO;
        } else if (rand < 0.666) {
          answerUser1 = Answer.IFNECESSARY;
          answerUser2 = Answer.IFNECESSARY;
        } else {
          answerUser1 = Answer.NO;
          answerUser2 = Answer.YES;
        }

        await prisma.vote.createMany({
          data: [
            {
              appointmentId: appointment.id,
              meetingId: noSpecificTimeMeeting.id,
              userId: user.id,
              answer: answerUser1,
            },
            {
              appointmentId: appointment.id,
              meetingId: noSpecificTimeMeeting.id,
              userId: user2.id,
              answer: answerUser2,
            },
          ],
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
