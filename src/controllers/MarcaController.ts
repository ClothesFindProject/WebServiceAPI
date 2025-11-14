import { NextFunction, Request, Response } from 'express';
import { MarcaService } from '../services/MarcaService';

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ message, data });

export const MarcaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const marca = await MarcaService.create(req.body);
      sendSuccess(res, 201, 'Marca criada com sucesso.', marca);
    } catch (error) {
      next(error);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const marcas = await MarcaService.list();
      sendSuccess(res, 200, 'Marcas listadas com sucesso.', marcas);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const marca = await MarcaService.findById(id);
      sendSuccess(res, 200, 'Marca encontrada com sucesso.', marca);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const marca = await MarcaService.update(id, req.body);
      sendSuccess(res, 200, 'Marca atualizada com sucesso.', marca);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await MarcaService.remove(id);
      sendSuccess(res, 200, 'Marca removida com sucesso.');
    } catch (error) {
      next(error);
    }
  },
};
