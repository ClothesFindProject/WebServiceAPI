import { CurtidaProdutoModel, CurtidaProduto, CurtidaProdutoInsert, CurtidaProdutoUpdate } from '../models/CurtidaProdutoModel';
import { UsuarioModel } from '../models/UsuarioModel';
import { ProdutoModel, Produto } from '../models/ProdutoModel';
import { ApiError } from '../utils/ApiError';

const ensureRelacionamentos = async (usuarioId: number, produtoId: number) => {
  const [usuario, produto] = await Promise.all([UsuarioModel.findById(usuarioId), ProdutoModel.findById(produtoId)]);
  if (!usuario) {
    throw ApiError.notFound('Usuário relacionado não encontrado');
  }
  if (!produto) {
    throw ApiError.notFound('Produto relacionado não encontrado');
  }
};

type ListFilters = {
  usuarioId?: number | undefined;
  produtoId?: number | undefined;
};

export const CurtidaProdutoService = {
  async create(data: CurtidaProdutoInsert): Promise<CurtidaProduto> {
    await ensureRelacionamentos(data.IdUsuario, data.IdProduto);
    return CurtidaProdutoModel.create(data);
  },

  async list(filters?: ListFilters): Promise<CurtidaProduto[]> {
    if (filters?.usuarioId) {
      return CurtidaProdutoModel.findByUsuario(filters.usuarioId);
    }
    if (filters?.produtoId) {
      return CurtidaProdutoModel.findByProduto(filters.produtoId);
    }
    return CurtidaProdutoModel.findAll();
  },

  async findById(id: number): Promise<CurtidaProduto> {
    const curtida = await CurtidaProdutoModel.findById(id);
    if (!curtida) {
      throw ApiError.notFound('Curtida não encontrada');
    }
    return curtida;
  },

  async update(id: number, data: CurtidaProdutoUpdate): Promise<CurtidaProduto> {
    if (data.IdUsuario || data.IdProduto) {
      const existing = await CurtidaProdutoModel.findById(id);
      if (!existing) {
        throw ApiError.notFound('Curtida não encontrada');
      }
      await ensureRelacionamentos(data.IdUsuario ?? existing.IdUsuario, data.IdProduto ?? existing.IdProduto);
    }
    const curtida = await CurtidaProdutoModel.update(id, data);
    if (!curtida) {
      throw ApiError.notFound('Curtida não encontrada');
    }
    return curtida;
  },

  async remove(id: number): Promise<void> {
    const deleted = await CurtidaProdutoModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Curtida não encontrada');
    }
  },

  async validateCurtida(usuarioId: number, produtoId: number) {
    const curtida = await CurtidaProdutoModel.findByUsuarioProduto(usuarioId, produtoId);
    return {
      existe: Boolean(curtida),
      ativo: curtida?.Ativo ?? false,
    };
  },

  async deactivateCurtida(usuarioId: number, produtoId: number) {
    const curtida = await CurtidaProdutoModel.findByUsuarioProduto(usuarioId, produtoId);
    if (!curtida) {
      throw ApiError.notFound('Curtida não encontrada');
    }
    if (!curtida.Ativo) {
      return curtida;
    }
    await CurtidaProdutoModel.setAtivoByUsuarioProduto(usuarioId, produtoId, false);
    return {
      ...curtida,
      Ativo: false,
    };
  },

  async listProdutosCurtidos(usuarioId: number): Promise<Produto[]> {
    const curtidas = await CurtidaProdutoModel.findByUsuario(usuarioId);
    const produtoIds = curtidas.filter((c) => c.Ativo).map((c) => c.IdProduto);
    const produtos = await Promise.all(produtoIds.map((id) => ProdutoModel.findById(id)));
    return produtos.filter((produto): produto is Produto => Boolean(produto));
  },
};
