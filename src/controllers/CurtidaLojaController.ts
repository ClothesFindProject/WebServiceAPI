import { NextFunction, Request, Response } from 'express';
import { CurtidaLojaService } from '../services/CurtidaLojaService';

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ message, data });

export const CurtidaLojaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const curtida = await CurtidaLojaService.create(req.body);
      sendSuccess(res, 201, 'Curtida registrada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
      const empresaId = req.query.empresaId ? Number(req.query.empresaId) : undefined;
      const curtidas = await CurtidaLojaService.list({ usuarioId, empresaId });
      sendSuccess(res, 200, 'Curtidas listadas com sucesso.', curtidas);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const curtida = await CurtidaLojaService.findById(id);
      sendSuccess(res, 200, 'Curtida encontrada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const curtida = await CurtidaLojaService.update(id, req.body);
      sendSuccess(res, 200, 'Curtida atualizada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await CurtidaLojaService.remove(id);
      sendSuccess(res, 200, 'Curtida removida com sucesso.');
    } catch (error) {
      next(error);
    }
  },

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = Number(req.params.idUsuario);
      const empresaId = Number(req.params.idEmpresa);
      const resultado = await CurtidaLojaService.validateCurtida(usuarioId, empresaId);
      sendSuccess(res, 200, 'Validação realizada com sucesso.', resultado);
    } catch (error) {
      next(error);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = Number(req.params.idUsuario);
      const empresaId = Number(req.params.idEmpresa);
      const curtida = await CurtidaLojaService.deactivateCurtida(usuarioId, empresaId);
      sendSuccess(res, 200, 'Curtida desativada com sucesso.', curtida);
    } catch (error) {
      next(error);
    }
  },

  async listEmpresasCurtidas(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = Number(req.params.idUsuario);
      const empresas = await CurtidaLojaService.listEmpresasCurtidas(usuarioId);
      sendSuccess(res, 200, 'Empresas curtidas retornadas com sucesso.', empresas);
    } catch (error) {
      next(error);
    }
  },
};
