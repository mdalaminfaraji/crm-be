import app from '../src/index';
import { createServer } from 'http';

// Create a simple HTTP server
const server = createServer(app);

// Export a serverless-compatible handler
export default async function handler(req: any, res: any) {
  // Let the Express app handle the request
  await new Promise<void>((resolve) => {
    server.emit('request', req, res);
    res.on('finish', resolve);
  });
}
