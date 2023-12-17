import { Router } from 'express';

import { loginSchema, refreshSchema, registerSchema } from '../../zod/auth.schema';
import {
    loginHandler,
    logoutHandler,
    refreshAccessTokenHandler,
    registerHandler,
} from '../../controller/auth.controller';
import { validateBody, validateHeaders } from '../../middleware/validate';
import { asyncController as async } from '../../middleware/asyncHandler';
import { protect } from '../../middleware/auth';

const router = Router();


// @desc   Login
// @route  POST /auth/login
// @access Public
router.route('/login').post(validateBody(loginSchema), async(loginHandler));

// @desc   Register
// @route  POST /auth/register
// @access Public
router
    .route('/register')
    .post(validateBody(registerSchema), async(registerHandler));

// @desc   Refresh access token
// @route  POST /api/v1/auth/refresh
// @access Public
/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successful response
 */
router
    .route('/refresh')
    .post(
        validateHeaders(refreshSchema),
        async(refreshAccessTokenHandler)
    );

// @desc   Logout route
// @route  GET /auth/logout
// @access Public
router.route('/logout').get(protect('TOKEN'), async(logoutHandler));

export default router;
