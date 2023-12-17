import { TypeOf, object, string } from 'zod';
export const registerSchema = object({
    firstname: string({
        required_error: 'First name is required',
    }),
    lastname: string({
        required_error: 'Last name is required',
    }),
    password: string({
        required_error: 'Password is required',
    }).min(6),
    email: string({
        required_error: 'Email is required',
    }).email('Please enter a valid email'),
})


export const loginSchema = object({
    email: string({ required_error: 'Email is required' }).email(
        'Please enter a valid email'
    ),
    password: string({ required_error: 'Password is required' }).min(
        6,
        'Minimum 6 characters'
    ),
})

export const refreshSchema = object({
    'headers.x-refresh': string({
        required_error: 'Refresh Token is required',
    }),
});

export type RefreshSchemaType = TypeOf<typeof refreshSchema>;
