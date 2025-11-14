import { NextFunction, Request, Response } from 'express';
import { ImagemService } from '../services/ImagemService';

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ message, data });

export const ImagemController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const imagem = await ImagemService.create(req.body);
      sendSuccess(res, 201, 'Imagem cadastrada com sucesso.', imagem);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const produtoId = req.query.produtoId ? Number(req.query.produtoId) : undefined;
      const imagens = await ImagemService.list(produtoId);
      sendSuccess(res, 200, 'Imagens listadas com sucesso.', imagens);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const imagem = await ImagemService.findById(id);
      sendSuccess(res, 200, 'Imagem encontrada com sucesso.', imagem);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const imagem = await ImagemService.update(id, req.body);
      sendSuccess(res, 200, 'Imagem atualizada com sucesso.', imagem);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ImagemService.remove(id);
      sendSuccess(res, 200, 'Imagem removida com sucesso.');
    } catch (error) {
      next(error);
    }
  },
};
