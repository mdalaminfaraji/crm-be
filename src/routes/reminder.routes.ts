import { 
  getAllReminders, 
  getReminderById, 
  createReminder, 
  updateReminder, 
  deleteReminder 
} from '../controllers/reminder.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createReminderSchema, updateReminderSchema } from '../utils/validation';
import { createRouter } from '../utils/router';

const { router, get, post, put, delete: del, use } = createRouter();

// Apply authentication middleware to all reminder routes
use(authenticate);

// Get all reminders (with optional filtering)
get('/', getAllReminders);

// Get reminder by ID
get('/:id', getReminderById);

// Create a new reminder
post('/', validate(createReminderSchema), createReminder);

// Update a reminder
put('/:id', validate(updateReminderSchema), updateReminder);

// Delete a reminder
del('/:id', deleteReminder);

export default router;
