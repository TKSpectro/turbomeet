import { z } from 'zod';

export const zMeetingCreateInput = z.object({
  title: z.string().min(1, { message: 'Must be at least 1 character long' }),
  description: z.string().max(300, { message: 'Must be 300 or less characters long' }).nullable(),
  deadline: z.date().nullable(),
  appointments: z.string().array(),
  participants: z
    .string()
    .email({ message: 'Every comma separated text must be an email' })
    .array()
    .optional(),
});

export const zMeetingUpdateInput = z.object({
  id: z.string(),
  data: z.object({
    title: z.string().min(1, { message: 'Must be at least 1 character long' }).optional(),
    description: z.string().max(300, { message: 'Must be 300 or less characters long' }).optional(),
    deadline: z.date().optional(),
    closed: z.boolean().optional(),
    participants: z
      .string()
      .email({ message: 'Every comma separated text must be an email' })
      .array()
      .optional(),
  }),
});
