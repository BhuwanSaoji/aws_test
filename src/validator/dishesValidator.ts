import { z } from 'zod';

export const dishSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    ingredients: z.string().min(1, "Ingredients cannot be empty"),
    diet: z.union([z.string(), z.number()]),
    prep_time: z.number().nonnegative("Prep time must be a non-negative number"),
    cook_time: z.number().nonnegative("Cook time must be a non-negative number"),
    flavor_profile: z.union([z.string(), z.number()]),
    course: z.union([z.string(), z.number()]),
    state: z.union([z.string(), z.number()]),
    region: z.union([z.string(), z.number()]),
});

export type Dish = z.infer<typeof dishSchema>;
