import { z } from 'zod';

export const zMeetingCreateInput = z.object({
  title: z.string().min(1, { message: 'Must be at least 1 character long' }),
  description: z.string().max(300, { message: 'Must be 300 or less characters long' }).nullable(),
  deadline: z.date().nullable(),
  appointments: z
    .array(
      z.object({
        date: z.date(),
        times: z.array(
          z.object({
            start: z.date().nullable(),
            end: z.date().nullable(),
          }),
        ),
      }),
    )
    .nullable(),
});
