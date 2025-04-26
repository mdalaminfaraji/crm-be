import { 
  getAllInteractions, 
  getInteractionById, 
  createInteraction, 
  updateInteraction, 
  deleteInteraction 
} from '../controllers/interaction.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createInteractionSchema, updateInteractionSchema } from '../utils/validation';
import { createRouter } from '../utils/router';

const { router, get, post, put, delete: del, use } = createRouter();

// Apply authentication middleware to all interaction routes
use(authenticate);

// Get all interactions (with optional filtering)
get('/', getAllInteractions);

// Get interaction by ID
get('/:id', getInteractionById);

// Create a new interaction
post('/', validate(createInteractionSchema), createInteraction);

// Update an interaction
put('/:id', validate(updateInteractionSchema), updateInteraction);

// Delete an interaction
del('/:id', deleteInteraction);

export default router;
