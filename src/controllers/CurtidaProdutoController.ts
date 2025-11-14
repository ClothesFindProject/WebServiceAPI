import { NextFunction, Request, Response } from 'express';
import { CurtidaProdutoService } from '../services/CurtidaProdutoService';

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ message, data });

export const CurtidaProdutoController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const curtida = await CurtidaProdutoService.create(req.body);
      sendSuccess(res, 201, 'Curtida de produto registrada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
      const produtoId = req.query.produtoId ? Number(req.query.produtoId) : undefined;
      const curtidas = await CurtidaProdutoService.list({ usuarioId, produtoId });
      sendSuccess(res, 200, 'Curtidas de produtos listadas com sucesso.', curtidas);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const curtida = await CurtidaProdutoService.findById(id);
      sendSuccess(res, 200, 'Curtida de produto encontrada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const curtida = await CurtidaProdutoService.update(id, req.body);
      sendSuccess(res, 200, 'Curtida de produto atualizada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await CurtidaProdutoService.remove(id);
      sendSuccess(res, 200, 'Curtida de produto removida com sucesso.');
    } catch (error) {
      next(error);
    }
  },

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = Number(req.params.idUsuario);
      const produtoId = Number(req.params.idProduto);
      const resultado = await CurtidaProdutoService.validateCurtida(usuarioId, produtoId);
      sendSuccess(res, 200, 'Validação realizada com sucesso.', resultado);
    } catch (error) {
      next(error);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = Number(req.params.idUsuario);
      const produtoId = Number(req.params.idProduto);
      const curtida = await CurtidaProdutoService.deactivateCurtida(usuarioId, produtoId);
      sendSuccess(res, 200, 'Curtida de produto desativada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async listProdutosCurtidos(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = Number(req.params.idUsuario);
      const produtos = await CurtidaProdutoService.listProdutosCurtidos(usuarioId);
      sendSuccess(res, 200, 'Produtos curtidos retornados com sucesso.', produtos);
    } catch (error) {
      next(error);
    }
  },
};
