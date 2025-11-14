import { ImagemModel, Imagem, ImagemInsert, ImagemUpdate } from '../models/ImagemModel';
import { ProdutoModel } from '../models/ProdutoModel';
import { ApiError } from '../utils/ApiError';

export const ImagemService = {
  async create(data: ImagemInsert): Promise<Imagem> {
    const produto = await ProdutoModel.findById(data.IdProduto);
    if (!produto) {
      throw ApiError.notFound('Produto relacionado não encontrado');
    }
    return ImagemModel.create(data);
  },

  async list(produtoId?: number): Promise<Imagem[]> {
    if (produtoId) {
      return ImagemModel.findByProdutoId(produtoId);
    }
    return ImagemModel.findAll();
  },

  async findById(id: number): Promise<Imagem> {
    const imagem = await ImagemModel.findById(id);
    if (!imagem) {
      throw ApiError.notFound('Imagem não encontrada');
    }
    return imagem;
  },

  async update(id: number, data: ImagemUpdate): Promise<Imagem> {
    if (data.IdProduto) {
      const produto = await ProdutoModel.findById(data.IdProduto);
      if (!produto) {
        throw ApiError.notFound('Produto relacionado não encontrado');
      }
    }
    const imagem = await ImagemModel.update(id, data);
    if (!imagem) {
      throw ApiError.notFound('Imagem não encontrada');
    }
    return imagem;
  },

  async remove(id: number): Promise<void> {
    const deleted = await ImagemModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Imagem não encontrada');
    }
  },
};
