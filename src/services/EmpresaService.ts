import { EmpresaModel, Empresa, EmpresaInsert, EmpresaUpdate } from '../models/EmpresaModel';
import { UsuarioModel } from '../models/UsuarioModel';
import { ProdutoModel, Produto } from '../models/ProdutoModel';
import { MarcaModel } from '../models/MarcaModel';
import type { ProdutoDetalhado } from './ProdutoService';
import { ApiError } from '../utils/ApiError';
import { uploadLogoEmpresa } from '../config/cloudflare';

export type EmpresaDetalhada = Empresa & {
  Produtos: ProdutoDetalhado[];
};

const buildProdutoDetalhadoParaEmpresa = async (produto: Produto, empresaNome: string): Promise<ProdutoDetalhado> => {
  const marca = produto.IdMarca ? await MarcaModel.findById(produto.IdMarca) : null;
  return {
    ...produto,
    MarcaInfo: marca ?? null,
    EmpresaNome: empresaNome,
  };
};

const attachProdutos = async (empresa: Empresa): Promise<EmpresaDetalhada> => {
  const produtos = await ProdutoModel.findByEmpresaId(empresa.Id);
  const produtosDetalhados = await Promise.all(
    produtos.map((produto) => buildProdutoDetalhadoParaEmpresa(produto, empresa.RazaoSocial)),
  );
  return {
    ...empresa,
    Produtos: produtosDetalhados,
  };
};

export const EmpresaService = {
  async create(data: EmpresaInsert, file?: any): Promise<Empresa> {
    const safeData = (data ?? {}) as EmpresaInsert;
    let imagemLogoUrl: string | undefined;

    if (file) {
      imagemLogoUrl = await uploadLogoEmpresa(file);
    }

    const payload: EmpresaInsert = {
      ...safeData,
      ImagemLogo: imagemLogoUrl ?? (safeData as any).ImagemLogo ?? null,
    };

    return EmpresaModel.create(payload);
  },

  async list(): Promise<EmpresaDetalhada[]> {
    const empresas = await EmpresaModel.findAll();
    return Promise.all(empresas.map((empresa) => attachProdutos(empresa)));
  },

  async findById(id: number): Promise<EmpresaDetalhada> {
    const empresa = await EmpresaModel.findById(id);
    if (!empresa) {
      throw ApiError.notFound('Empresa nǜo encontrada');
    }
    return attachProdutos(empresa);
  },

  async update(id: number, data: EmpresaUpdate): Promise<Empresa> {
    const safeData = (data ?? {}) as EmpresaUpdate;
    const empresa = await EmpresaModel.update(id, safeData);
    if (!empresa) {
      throw ApiError.notFound('Empresa nǜo encontrada');
    }
    return empresa;
  },

  async remove(id: number): Promise<void> {
    const deleted = await EmpresaModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Empresa nǜo encontrada');
    }
  },

  async associateUsuario(empresaId: number, usuarioId: number) {
    const empresa = await EmpresaModel.findById(empresaId);
    if (!empresa) {
      throw ApiError.notFound('Empresa nǜo encontrada');
    }
    const usuario = await UsuarioModel.findById(usuarioId);
    if (!usuario) {
      throw ApiError.notFound('Usuǭrio nǜo encontrado');
    }

    const updatedUsuario = await UsuarioModel.update(usuarioId, {
      EmpresaId: empresaId,
    });

    if (!updatedUsuario) {
      throw ApiError.badRequest('Nǜo foi poss��vel associar o usuǭrio �� empresa');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Senha, ...usuarioSemSenha } = updatedUsuario;

    return {
      empresa,
      usuario: usuarioSemSenha,
    };
  },
};
