import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../utils/validation';
import { createRouter } from '../utils/router';

const { router, post, get } = createRouter();

// Register a new user
post('/register', validate(registerSchema), register);

// Login user
post('/login', validate(loginSchema), login);

// Get user profile (protected route)
get('/profile', authenticate, getProfile);

export default router;
