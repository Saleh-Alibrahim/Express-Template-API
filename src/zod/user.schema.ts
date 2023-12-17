import { object, string } from 'zod';

export const updateUserSchema = object({
    firstname: string({
        required_error: 'firstname is required',
    }),
    lastname: string({
        required_error: 'lastname is required',
    }),
    email: string({
        required_error: 'email is required',
    }).email('not a vaild email'),
});
export const deactiveUserSchema = object({
    id: string({ required_error: 'id is required' }),
});

