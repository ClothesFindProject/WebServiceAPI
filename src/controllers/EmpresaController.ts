import { NextFunction, Request, Response } from 'express';
import { EmpresaService } from '../services/EmpresaService';

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ message, data });

export const EmpresaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const empresa = await EmpresaService.create(req.body);
      sendSuccess(res, 201, 'Empresa criada com sucesso.', empresa);
    } catch (error) {
      next(error);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const empresas = await EmpresaService.list();
      sendSuccess(res, 200, 'Empresas listadas com sucesso.', empresas);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const empresa = await EmpresaService.findById(id);
      sendSuccess(res, 200, 'Empresa recuperada com sucesso.', empresa);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const empresa = await EmpresaService.update(id, req.body);
      sendSuccess(res, 200, 'Empresa atualizada com sucesso.', empresa);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await EmpresaService.remove(id);
      sendSuccess(res, 200, 'Empresa removida com sucesso.');
    } catch (error) {
      next(error);
    }
  },

  async associateUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const empresaId = Number(req.params.id);
      const { usuarioId } = req.body as { usuarioId: number };
      if (!usuarioId) {
        return res.status(400).json({ message: 'usuarioId é obrigatório' });
      }
      const result = await EmpresaService.associateUsuario(empresaId, usuarioId);
      return sendSuccess(res, 200, 'Usuário associado à empresa com sucesso.', result);
    } catch (error) {
      next(error);
      return undefined;
    }
  },
};
