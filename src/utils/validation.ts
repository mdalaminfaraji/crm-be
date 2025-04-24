import { z } from 'zod';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Client validation schemas
export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

// Project validation schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  budget: z.number().positive().optional(),
  deadline: z.string().optional().transform(val => val ? new Date(val) : undefined),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  clientId: z.string().uuid('Invalid client ID'),
});

export const updateProjectSchema = createProjectSchema.partial();

// Interaction validation schemas
export const createInteractionSchema = z.object({
  date: z.string().transform(val => new Date(val)),
  type: z.enum(['CALL', 'EMAIL', 'MEETING', 'OTHER']),
  notes: z.string().optional(),
  clientId: z.string().uuid('Invalid client ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
}).refine(data => data.clientId || data.projectId, {
  message: 'Either clientId or projectId must be provided',
});

export const updateInteractionSchema = createInteractionSchema.partial();

// Reminder validation schemas
export const createReminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().transform(val => new Date(val)),
  completed: z.boolean().optional(),
  clientId: z.string().uuid('Invalid client ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
}).refine(data => data.clientId || data.projectId, {
  message: 'Either clientId or projectId must be provided',
});

export const updateReminderSchema = createReminderSchema.partial();
