import { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createProjectSchema, updateProjectSchema } from '../utils/validation';
import { createRouter } from '../utils/router';

const { router, get, post, put, delete: del, use } = createRouter();

// Apply authentication middleware to all project routes
use(authenticate);

// Get all projects
get('/', getAllProjects);

// Get project by ID
get('/:id', getProjectById);

// Create a new project
post('/', validate(createProjectSchema), createProject);

// Update a project
put('/:id', validate(updateProjectSchema), updateProject);

// Delete a project
del('/:id', deleteProject);

export default router;
