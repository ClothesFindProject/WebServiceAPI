import { NextFunction, Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';

type SuccessResponse<T> = {
  message: string;
  data?: T;
};

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T): Response<SuccessResponse<T>> =>
  res.status(status).json({ message, data });

export const UsuarioController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file;
      const usuario = await UsuarioService.register(req.body, file);
      sendSuccess(res, 201, 'Usuário criado com sucesso.', usuario);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await UsuarioService.login(req.body);
      sendSuccess(res, 200, 'Login realizado com sucesso.', resultado);
    } catch (error) {
      next(error);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await UsuarioService.findAll();
      sendSuccess(res, 200, 'Usuários listados com sucesso.', usuarios);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const usuario = await UsuarioService.findById(id);
      sendSuccess(res, 200, 'Usuário recuperado com sucesso.', usuario);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const file = (req as any).file;
      const usuario = await UsuarioService.update(id, req.body, file);
      sendSuccess(res, 200, 'Usuário atualizado com sucesso.', usuario);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await UsuarioService.remove(id);
      sendSuccess(res, 200, 'Usuário removido com sucesso.');
    } catch (error) {
      next(error);
    }
  },

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { Ativo } = req.body as { Ativo: unknown };
      const usuario = await UsuarioService.changeStatus(id, Ativo);
      sendSuccess(res, 200, 'Status do usuário atualizado com sucesso.', usuario);
    } catch (error) {
      next(error);
    }
  },
};
