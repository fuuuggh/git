import * as z from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
    name: z.string().min(3, { message: 'Name is required' }),
    email: z.string().email({ message: 'Email is required.' }),
    message: z
        .string()
        .min(4, {
            message: 'Your message must be at least 4 characters long.',
        })
        .max(320, {
            message: 'Your message cannot be more than 320 characters long.',
        }),
});
