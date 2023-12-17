import { ZodFormattedError } from 'zod';
import z from 'zod';

export const schema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.string(),
    CLIENT_URL: z.string().url(),
    TRUST_PROXY_COUNT: z.string(),
    NODE_ENV: z.enum(['development', 'staging', 'production']),
    API_RATE_LIMIT_COUNT: z.string(),
    API_RATE_LIMIT_TIME: z.string(),
    ACCESS_TOKEN_PUBLIC_KEY: z.string(),
    ACCESS_TOKEN_PRIVATE_KEY: z.string(),
    REFRESH_TOKEN_PUBLIC_KEY: z.string(),
    REFRESH_TOKEN_PRIVATE_KEY: z.string(),
});

const formatErrors = (errors: ZodFormattedError<Map<string, string>>) => {
    return Object.entries(errors)
        .map(([name, value]) => {
            if (value && '_errors' in value)
                return `${name}: ${value._errors.join(', ')}\n`;
        })
        .filter(Boolean);
};

const _serverEnv = schema.safeParse(process.env);

if (_serverEnv.success === false) {
    console.error(
        '❌ Invalid environment variables:\n',
        ...formatErrors(_serverEnv.error.format())
    );
    throw new Error('Invalid environment variables');
}

export const env = { ..._serverEnv.data };
