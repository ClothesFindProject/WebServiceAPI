import { EmpresaModel, Empresa, EmpresaInsert, EmpresaUpdate } from '../models/EmpresaModel';
import { UsuarioModel } from '../models/UsuarioModel';
import { ProdutoModel, Produto } from '../models/ProdutoModel';
import { MarcaModel } from '../models/MarcaModel';
import type { ProdutoDetalhado } from './ProdutoService';
import { ApiError } from '../utils/ApiError';

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
  async create(data: EmpresaInsert): Promise<Empresa> {
    return EmpresaModel.create(data);
  },

  async list(): Promise<EmpresaDetalhada[]> {
    const empresas = await EmpresaModel.findAll();
    return Promise.all(empresas.map((empresa) => attachProdutos(empresa)));
  },

  async findById(id: number): Promise<EmpresaDetalhada> {
    const empresa = await EmpresaModel.findById(id);
    if (!empresa) {
      throw ApiError.notFound('Empresa não encontrada');
    }
    return attachProdutos(empresa);
  },

  async update(id: number, data: EmpresaUpdate): Promise<Empresa> {
    const empresa = await EmpresaModel.update(id, {
      ...data,
      DataAtualizacao: data.DataAtualizacao ?? new Date(),
    });
    if (!empresa) {
      throw ApiError.notFound('Empresa não encontrada');
    }
    return empresa;
  },

  async remove(id: number): Promise<void> {
    const deleted = await EmpresaModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Empresa não encontrada');
    }
  },

  async associateUsuario(empresaId: number, usuarioId: number) {
    const empresa = await EmpresaModel.findById(empresaId);
    if (!empresa) {
      throw ApiError.notFound('Empresa não encontrada');
    }
    const usuario = await UsuarioModel.findById(usuarioId);
    if (!usuario) {
      throw ApiError.notFound('Usuário não encontrado');
    }

    const updatedUsuario = await UsuarioModel.update(usuarioId, {
      EmpresaId: empresaId,
    });

    if (!updatedUsuario) {
      throw ApiError.badRequest('Não foi possível associar o usuário à empresa');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Senha, ...usuarioSemSenha } = updatedUsuario;

    return {
      empresa,
      usuario: usuarioSemSenha,
    };
  },
};
