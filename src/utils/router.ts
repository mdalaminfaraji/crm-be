import { Router, Request, Response, NextFunction, RequestHandler } from 'express';

// Create a wrapper for Express Router to handle TypeScript typing issues
export const createRouter = () => {
  const router = Router();

  // Type assertion function to bypass TypeScript's strict checking
  // This is a workaround for the incompatibility between controller return types and Express expectations
  const asHandler = <T>(handler: T): RequestHandler => handler as unknown as RequestHandler;

  // Wrap the router methods to handle TypeScript typing issues
  const get = (path: string, ...handlers: any[]) => {
    return router.get(path, ...handlers.map(asHandler));
  };

  const post = (path: string, ...handlers: any[]) => {
    return router.post(path, ...handlers.map(asHandler));
  };

  const put = (path: string, ...handlers: any[]) => {
    return router.put(path, ...handlers.map(asHandler));
  };

  const del = (path: string, ...handlers: any[]) => {
    return router.delete(path, ...handlers.map(asHandler));
  };

  const use = (path: string | any, ...handlers: any[]) => {
    if (typeof path === 'string') {
      return router.use(path, ...handlers.map(asHandler));
    } else {
      return router.use(asHandler(path), ...handlers.map(asHandler));
    }
  };

  return {
    router,
    get,
    post,
    put,
    delete: del,
    use,
  };
};
