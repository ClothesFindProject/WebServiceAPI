import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction): Response => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erro interno do servidor' });
};

export const notFoundHandler = (_req: Request, res: Response): Response =>
  res.status(404).json({ message: 'Rota não encontrada' });
