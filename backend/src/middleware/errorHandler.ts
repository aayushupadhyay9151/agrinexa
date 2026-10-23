import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[AgriNexa Error Handler]:', err);

  const statusCode = err.statusCode || 500;
  const userMessage = err.isOperational
    ? err.message
    : 'An unexpected agricultural processing error occurred. Please verify inputs or try again.';

  res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(process.env.NODE_ENV === 'development' ? { debug: err.message } : {})
  });
}
