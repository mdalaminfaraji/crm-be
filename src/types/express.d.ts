import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;
