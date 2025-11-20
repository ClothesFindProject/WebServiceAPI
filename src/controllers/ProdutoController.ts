import { NextFunction, Request, Response } from 'express';
import { ProdutoService } from '../services/ProdutoService';

const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ message, data });

export const ProdutoController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;
      const body = { ...(req.body as any) };

      // normaliza campos do body (multipart vem como string)
      if (typeof body.Tags === 'string') {
        try {
          body.Tags = JSON.parse(body.Tags);
        } catch {
          body.Tags = body.Tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
      if (typeof body.IdEmpresa === 'string') body.IdEmpresa = Number(body.IdEmpresa);
      if (typeof body.IdMarca === 'string' && body.IdMarca !== '') body.IdMarca = Number(body.IdMarca);

      // metadados opcionais das imagens (descricao)
      let imagensMeta: Array<{ Descricao?: string | null }> = [];
      if (typeof body.ImagensMetadata === 'string') {
        try {
          const parsed = JSON.parse(body.ImagensMetadata);
          if (Array.isArray(parsed)) {
            imagensMeta = parsed.map((item) => ({
              Descricao: item?.Descricao ?? null,
            }));
          }
        } catch {
          imagensMeta = [];
        }
      }
      body.Imagens = imagensMeta;
      delete body.ImagensMetadata;

      const produto = await ProdutoService.create(body, files);
      sendSuccess(res, 201, 'Produto criado com sucesso.', produto);
    } catch (error) {
      next(error);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await ProdutoService.list();
      sendSuccess(res, 200, 'Produtos listados com sucesso.', produtos);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const produto = await ProdutoService.findById(id);
      sendSuccess(res, 200, 'Produto encontrado com sucesso.', produto);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const produto = await ProdutoService.update(id, req.body);
      sendSuccess(res, 200, 'Produto atualizado com sucesso.', produto);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ProdutoService.remove(id);
      sendSuccess(res, 200, 'Produto removido com sucesso.');
    } catch (error) {
      next(error);
    }
  },
};
