import type { Express } from 'express';
import { ProdutoModel, Produto, ProdutoInsert, ProdutoUpdate } from '../models/ProdutoModel';
import { ApiError } from '../utils/ApiError';
import { EmpresaModel } from '../models/EmpresaModel';
import { MarcaModel, Marca } from '../models/MarcaModel';
import { ImagemModel, Imagem, ImagemInsert } from '../models/ImagemModel';
import { uploadImagemProduto } from '../config/cloudflare';

export type ProdutoDetalhado = Produto & {
  MarcaInfo: Marca | null;
  EmpresaNome: string | null;
  Imagens?: Imagem[];
};

const ensureEmpresa = async (empresaId: number) => {
  const empresa = await EmpresaModel.findById(empresaId);
  if (!empresa) {
    throw ApiError.notFound('Empresa relacionada não encontrada');
  }
};

const ensureMarca = async (marcaId?: number | null) => {
  if (!marcaId) {
    return;
  }
  const marca = await MarcaModel.findById(marcaId);
  if (!marca) {
    throw ApiError.notFound('Marca relacionada não encontrada');
  }
};

const buildProdutoDetalhado = async (produto: Produto): Promise<ProdutoDetalhado> => {
  const [marca, empresa, imagens] = await Promise.all([
    produto.IdMarca ? MarcaModel.findById(produto.IdMarca) : Promise.resolve(null),
    EmpresaModel.findById(produto.IdEmpresa),
    ImagemModel.findByProdutoId(produto.Id),
  ]);

  return {
    ...produto,
    MarcaInfo: marca ?? null,
    EmpresaNome: empresa?.RazaoSocial ?? null,
    Imagens: imagens ?? [],
  };
};

export const ProdutoService = {
  async create(
    data: ProdutoInsert & { Imagens?: Array<{ UrlImg?: string; Descricao?: string | null }> },
    files?: Express.Multer.File[],
  ): Promise<ProdutoDetalhado> {
    if (!data.IdEmpresa) {
      throw ApiError.badRequest('Esse produto precisa estar associado a uma empresa');
    }
    await ensureEmpresa(data.IdEmpresa);
    await ensureMarca(data.IdMarca);
    const produto = await ProdutoModel.create(data);

    // cria imagens vinculadas ao produto recem criado
    const imagensMeta = data.Imagens ?? [];
    const imagensPayload: Array<{
      file?: Express.Multer.File;
      data?: { UrlImg?: string; Descricao?: string | null } | undefined;
    }> =
      files && files.length > 0
        ? files.map((file, idx) => ({ file, data: imagensMeta[idx] }))
        : imagensMeta.map((img) => ({ data: img }));
    if (imagensPayload.length > 0) {
      await Promise.all(
        imagensPayload.map(async ({ file, data: img }) => {
          let urlImg = img?.UrlImg;
          if (file) {
            urlImg = await uploadImagemProduto(file);
          }
          if (!urlImg) return;
          const payload: ImagemInsert = {
            UrlImg: urlImg,
            Descricao: img?.Descricao ?? null,
            IdProduto: produto.Id,
          };
          await ImagemModel.create(payload);
        }),
      );
    }

    return buildProdutoDetalhado(produto);
  },

  async list(): Promise<ProdutoDetalhado[]> {
    const produtos = await ProdutoModel.findAll();
    return Promise.all(produtos.map((produto) => buildProdutoDetalhado(produto)));
  },

  async findById(id: number): Promise<ProdutoDetalhado> {
    const produto = await ProdutoModel.findById(id);
    if (!produto) {
      throw ApiError.notFound('Produto não encontrado');
    }
    return buildProdutoDetalhado(produto);
  },

  async update(id: number, data: ProdutoUpdate): Promise<ProdutoDetalhado> {
    if (data.IdEmpresa) {
      await ensureEmpresa(data.IdEmpresa);
    }
    if (data.IdMarca !== undefined) {
      await ensureMarca(data.IdMarca ?? null);
    }
    const produto = await ProdutoModel.update(id, {
      ...data,
      DataAtualizacao: data.DataAtualizacao ?? new Date(),
    });
    if (!produto) {
      throw ApiError.notFound('Produto não encontrado');
    }
    return buildProdutoDetalhado(produto);
  },

  async remove(id: number): Promise<void> {
    const deleted = await ProdutoModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Produto não encontrado');
    }
  },
};
