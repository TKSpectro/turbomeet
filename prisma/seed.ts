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

  const meeting = await prisma.meeting.create({
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

  const appointments = await prisma.appointment.findMany({
    where: {
      meetingId: meeting.id,
    },
  });

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
          userId: user.id,
          answer: answerUser1,
        },
        {
          appointmentId: appointment.id,
          userId: user2.id,
          answer: answerUser2,
        },
      ],
    });
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
