import { 
  getAllClients, 
  getClientById, 
  createClient, 
  updateClient, 
  deleteClient 
} from '../controllers/client.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createClientSchema, updateClientSchema } from '../utils/validation';
import { createRouter } from '../utils/router';

const { router, get, post, put, delete: del, use } = createRouter();

// Apply authentication middleware to all client routes
use(authenticate);

// Get all clients
get('/', getAllClients);

// Get client by ID
get('/:id', getClientById);

// Create a new client
post('/', validate(createClientSchema), createClient);

// Update a client
put('/:id', validate(updateClientSchema), updateClient);

// Delete a client
del('/:id', deleteClient);

export default router;
