"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurtidaProdutoService = void 0;
const CurtidaProdutoModel_1 = require("../models/CurtidaProdutoModel");
const UsuarioModel_1 = require("../models/UsuarioModel");
const ProdutoModel_1 = require("../models/ProdutoModel");
const ApiError_1 = require("../utils/ApiError");
const ensureRelacionamentos = async (usuarioId, produtoId) => {
    const [usuario, produto] = await Promise.all([UsuarioModel_1.UsuarioModel.findById(usuarioId), ProdutoModel_1.ProdutoModel.findById(produtoId)]);
    if (!usuario) {
        throw ApiError_1.ApiError.notFound('Usuário relacionado não encontrado');
    }
    if (!produto) {
        throw ApiError_1.ApiError.notFound('Produto relacionado não encontrado');
    }
};
exports.CurtidaProdutoService = {
    async create(data) {
        await ensureRelacionamentos(data.IdUsuario, data.IdProduto);
        return CurtidaProdutoModel_1.CurtidaProdutoModel.create(data);
    },
    async list(filters) {
        if (filters?.usuarioId) {
            return CurtidaProdutoModel_1.CurtidaProdutoModel.findByUsuario(filters.usuarioId);
        }
        if (filters?.produtoId) {
            return CurtidaProdutoModel_1.CurtidaProdutoModel.findByProduto(filters.produtoId);
        }
        return CurtidaProdutoModel_1.CurtidaProdutoModel.findAll();
    },
    async findById(id) {
        const curtida = await CurtidaProdutoModel_1.CurtidaProdutoModel.findById(id);
        if (!curtida) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
        return curtida;
    },
    async update(id, data) {
        if (data.IdUsuario || data.IdProduto) {
            const existing = await CurtidaProdutoModel_1.CurtidaProdutoModel.findById(id);
            if (!existing) {
                throw ApiError_1.ApiError.notFound('Curtida não encontrada');
            }
            await ensureRelacionamentos(data.IdUsuario ?? existing.IdUsuario, data.IdProduto ?? existing.IdProduto);
        }
        const curtida = await CurtidaProdutoModel_1.CurtidaProdutoModel.update(id, data);
        if (!curtida) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
        return curtida;
    },
    async remove(id) {
        const deleted = await CurtidaProdutoModel_1.CurtidaProdutoModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
    },
    async validateCurtida(usuarioId, produtoId) {
        const curtida = await CurtidaProdutoModel_1.CurtidaProdutoModel.findByUsuarioProduto(usuarioId, produtoId);
        return {
            existe: Boolean(curtida),
            ativo: curtida?.Ativo ?? false,
        };
    },
    async deactivateCurtida(usuarioId, produtoId) {
        const curtida = await CurtidaProdutoModel_1.CurtidaProdutoModel.findByUsuarioProduto(usuarioId, produtoId);
        if (!curtida) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
        if (!curtida.Ativo) {
            return curtida;
        }
        await CurtidaProdutoModel_1.CurtidaProdutoModel.setAtivoByUsuarioProduto(usuarioId, produtoId, false);
        return {
            ...curtida,
            Ativo: false,
        };
    },
    async listProdutosCurtidos(usuarioId) {
        const curtidas = await CurtidaProdutoModel_1.CurtidaProdutoModel.findByUsuario(usuarioId);
        const produtoIds = curtidas.filter((c) => c.Ativo).map((c) => c.IdProduto);
        const produtos = await Promise.all(produtoIds.map((id) => ProdutoModel_1.ProdutoModel.findById(id)));
        return produtos.filter((produto) => Boolean(produto));
    },
};
//# sourceMappingURL=CurtidaProdutoService.js.map