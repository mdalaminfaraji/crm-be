import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

export const validate = (schema: ZodType<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body against schema
      const validatedData = await schema.parseAsync(req.body);
      
      // Replace request body with validated data
      req.body = validatedData;
      
      return next();
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        message: 'Internal server error during validation'
      });
    }
  };
};
