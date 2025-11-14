"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const EmpresaModel_1 = require("../models/EmpresaModel");
const UsuarioModel_1 = require("../models/UsuarioModel");
const ProdutoModel_1 = require("../models/ProdutoModel");
const MarcaModel_1 = require("../models/MarcaModel");
const ApiError_1 = require("../utils/ApiError");
const buildProdutoDetalhadoParaEmpresa = async (produto, empresaNome) => {
    const marca = produto.IdMarca ? await MarcaModel_1.MarcaModel.findById(produto.IdMarca) : null;
    return {
        ...produto,
        MarcaInfo: marca ?? null,
        EmpresaNome: empresaNome,
    };
};
const attachProdutos = async (empresa) => {
    const produtos = await ProdutoModel_1.ProdutoModel.findByEmpresaId(empresa.Id);
    const produtosDetalhados = await Promise.all(produtos.map((produto) => buildProdutoDetalhadoParaEmpresa(produto, empresa.RazaoSocial)));
    return {
        ...empresa,
        Produtos: produtosDetalhados,
    };
};
exports.EmpresaService = {
    async create(data) {
        return EmpresaModel_1.EmpresaModel.create(data);
    },
    async list() {
        const empresas = await EmpresaModel_1.EmpresaModel.findAll();
        return Promise.all(empresas.map((empresa) => attachProdutos(empresa)));
    },
    async findById(id) {
        const empresa = await EmpresaModel_1.EmpresaModel.findById(id);
        if (!empresa) {
            throw ApiError_1.ApiError.notFound('Empresa não encontrada');
        }
        return attachProdutos(empresa);
    },
    async update(id, data) {
        const empresa = await EmpresaModel_1.EmpresaModel.update(id, {
            ...data,
            DataAtualizacao: data.DataAtualizacao ?? new Date(),
        });
        if (!empresa) {
            throw ApiError_1.ApiError.notFound('Empresa não encontrada');
        }
        return empresa;
    },
    async remove(id) {
        const deleted = await EmpresaModel_1.EmpresaModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Empresa não encontrada');
        }
    },
    async associateUsuario(empresaId, usuarioId) {
        const empresa = await EmpresaModel_1.EmpresaModel.findById(empresaId);
        if (!empresa) {
            throw ApiError_1.ApiError.notFound('Empresa não encontrada');
        }
        const usuario = await UsuarioModel_1.UsuarioModel.findById(usuarioId);
        if (!usuario) {
            throw ApiError_1.ApiError.notFound('Usuário não encontrado');
        }
        const updatedUsuario = await UsuarioModel_1.UsuarioModel.update(usuarioId, {
            EmpresaId: empresaId,
        });
        if (!updatedUsuario) {
            throw ApiError_1.ApiError.badRequest('Não foi possível associar o usuário à empresa');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Senha, ...usuarioSemSenha } = updatedUsuario;
        return {
            empresa,
            usuario: usuarioSemSenha,
        };
    },
};
//# sourceMappingURL=EmpresaService.js.map