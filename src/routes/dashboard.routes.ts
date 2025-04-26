import { getDashboardData } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { createRouter } from '../utils/router';

const { router, get, use } = createRouter();

// Apply authentication middleware to all dashboard routes
use(authenticate);

// Get dashboard data
get('/', getDashboardData);

export default router;
