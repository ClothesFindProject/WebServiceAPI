import type { Express } from 'express';
import { MarcaModel, Marca, MarcaInsert, MarcaUpdate } from '../models/MarcaModel';
import { ApiError } from '../utils/ApiError';
import { uploadImagemMarca } from '../config/cloudflare';

export const MarcaService = {
  async create(data: MarcaInsert, file?: Express.Multer.File): Promise<Marca> {
    const imgUrl = file ? await uploadImagemMarca(file) : data.ImgMarca ?? null;
    return MarcaModel.create({
      ...data,
      ImgMarca: imgUrl,
    });
  },

  async list(): Promise<Marca[]> {
    return MarcaModel.findAll();
  },

  async findById(id: number): Promise<Marca> {
    const marca = await MarcaModel.findById(id);
    if (!marca) {
      throw ApiError.notFound('Marca nǜo encontrada');
    }
    return marca;
  },

  async update(id: number, data: MarcaUpdate, file?: Express.Multer.File): Promise<Marca> {
    const imgUrl = file ? await uploadImagemMarca(file) : data.ImgMarca ?? null;
    const marca = await MarcaModel.update(id, {
      ...data,
      ImgMarca: imgUrl,
    });
    if (!marca) {
      throw ApiError.notFound('Marca nǜo encontrada');
    }
    return marca;
  },

  async changeStatus(id: number, ativo: unknown): Promise<Marca> {
    const parsedAtivo =
      typeof ativo === 'string' ? ['true', '1', 'yes', 'on'].includes(ativo.toLowerCase()) : Boolean(ativo);
    const marca = await MarcaModel.update(id, { Ativo: parsedAtivo });
    if (!marca) {
      throw ApiError.notFound('Marca nǜo encontrada');
    }
    return marca;
  },

  async remove(id: number): Promise<void> {
    const deleted = await MarcaModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Marca nǜo encontrada');
    }
  },
};
