import { z } from 'zod';

export const userSchema = z.object({
    username: z.string().min(1, "Name cannot be empty"),
    password: z.string().min(1, "password cannot be empty"),
})

export type Dish = z.infer<typeof userSchema>;
