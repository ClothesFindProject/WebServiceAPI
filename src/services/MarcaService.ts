import { MarcaModel, Marca, MarcaInsert, MarcaUpdate } from '../models/MarcaModel';
import { ApiError } from '../utils/ApiError';

export const MarcaService = {
  async create(data: MarcaInsert): Promise<Marca> {
    return MarcaModel.create(data);
  },

  async list(): Promise<Marca[]> {
    return MarcaModel.findAll();
  },

  async findById(id: number): Promise<Marca> {
    const marca = await MarcaModel.findById(id);
    if (!marca) {
      throw ApiError.notFound('Marca não encontrada');
    }
    return marca;
  },

  async update(id: number, data: MarcaUpdate): Promise<Marca> {
    const marca = await MarcaModel.update(id, data);
    if (!marca) {
      throw ApiError.notFound('Marca não encontrada');
    }
    return marca;
  },

  async remove(id: number): Promise<void> {
    const deleted = await MarcaModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Marca não encontrada');
    }
  },
};
