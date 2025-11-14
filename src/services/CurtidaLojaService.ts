import { CurtidaLojaModel, CurtidaLoja, CurtidaLojaInsert, CurtidaLojaUpdate } from '../models/CurtidaLojaModel';
import { UsuarioModel } from '../models/UsuarioModel';
import { EmpresaModel, Empresa } from '../models/EmpresaModel';
import { ApiError } from '../utils/ApiError';

const ensureRelacionamentos = async (usuarioId: number, empresaId: number) => {
  const [usuario, empresa] = await Promise.all([UsuarioModel.findById(usuarioId), EmpresaModel.findById(empresaId)]);
  if (!usuario) {
    throw ApiError.notFound('Usuário relacionado não encontrado');
  }
  if (!empresa) {
    throw ApiError.notFound('Empresa relacionada não encontrada');
  }
};

type ListFilters = {
  usuarioId?: number | undefined;
  empresaId?: number | undefined;
};

export const CurtidaLojaService = {
  async create(data: CurtidaLojaInsert): Promise<CurtidaLoja> {
    await ensureRelacionamentos(data.IdUsuario, data.IdEmpresa);
    return CurtidaLojaModel.create(data);
  },

  async list(filters?: ListFilters): Promise<CurtidaLoja[]> {
    if (filters?.usuarioId) {
      return CurtidaLojaModel.findByUsuario(filters.usuarioId);
    }
    if (filters?.empresaId) {
      return CurtidaLojaModel.findByEmpresa(filters.empresaId);
    }
    return CurtidaLojaModel.findAll();
  },

  async findById(id: number): Promise<CurtidaLoja> {
    const curtida = await CurtidaLojaModel.findById(id);
    if (!curtida) {
      throw ApiError.notFound('Curtida não encontrada');
    }
    return curtida;
  },

  async update(id: number, data: CurtidaLojaUpdate): Promise<CurtidaLoja> {
    if (data.IdUsuario || data.IdEmpresa) {
      const existing = await CurtidaLojaModel.findById(id);
      if (!existing) {
        throw ApiError.notFound('Curtida não encontrada');
      }
      await ensureRelacionamentos(data.IdUsuario ?? existing.IdUsuario, data.IdEmpresa ?? existing.IdEmpresa);
    }
    const curtida = await CurtidaLojaModel.update(id, data);
    if (!curtida) {
      throw ApiError.notFound('Curtida não encontrada');
    }
    return curtida;
  },

  async remove(id: number): Promise<void> {
    const deleted = await CurtidaLojaModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Curtida não encontrada');
    }
  },

  async validateCurtida(usuarioId: number, empresaId: number) {
    const curtida = await CurtidaLojaModel.findByUsuarioEmpresa(usuarioId, empresaId);
    return {
      existe: Boolean(curtida),
      ativo: curtida?.Ativo ?? false,
    };
  },

  async deactivateCurtida(usuarioId: number, empresaId: number) {
    const curtida = await CurtidaLojaModel.findByUsuarioEmpresa(usuarioId, empresaId);
    if (!curtida) {
      throw ApiError.notFound('Curtida não encontrada');
    }
    if (!curtida.Ativo) {
      return curtida;
    }
    await CurtidaLojaModel.setAtivoByUsuarioEmpresa(usuarioId, empresaId, false);
    return {
      ...curtida,
      Ativo: false,
    };
  },
  async listEmpresasCurtidas(usuarioId: number): Promise<Empresa[]> {
    const curtidas = await CurtidaLojaModel.findByUsuario(usuarioId);
    const empresaIds = curtidas.filter((c) => c.Ativo).map((c) => c.IdEmpresa);
    const empresas = await Promise.all(empresaIds.map((id) => EmpresaModel.findById(id)));
    return empresas.filter((empresa): empresa is Empresa => Boolean(empresa));
  },
};
