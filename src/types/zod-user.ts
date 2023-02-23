import { z } from 'zod';

export const zUserUpdateInput = z.object({
  name: z.string().min(1, { message: 'Must be at least 1 character long' }).optional(),
});
