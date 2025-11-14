import { ProdutoModel, Produto, ProdutoInsert, ProdutoUpdate } from '../models/ProdutoModel';
import { ApiError } from '../utils/ApiError';
import { EmpresaModel } from '../models/EmpresaModel';
import { MarcaModel, Marca } from '../models/MarcaModel';

export type ProdutoDetalhado = Produto & {
  MarcaInfo: Marca | null;
  EmpresaNome: string | null;
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
  const [marca, empresa] = await Promise.all([
    produto.IdMarca ? MarcaModel.findById(produto.IdMarca) : Promise.resolve(null),
    EmpresaModel.findById(produto.IdEmpresa),
  ]);

  return {
    ...produto,
    MarcaInfo: marca ?? null,
    EmpresaNome: empresa?.RazaoSocial ?? null,
  };
};

export const ProdutoService = {
  async create(data: ProdutoInsert): Promise<ProdutoDetalhado> {
    if (!data.IdEmpresa) {
      throw ApiError.badRequest('Esse produto precisa estar associado a uma empresa');
    }
    await ensureEmpresa(data.IdEmpresa);
    await ensureMarca(data.IdMarca);
    const produto = await ProdutoModel.create(data);
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
