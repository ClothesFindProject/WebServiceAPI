"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoService = void 0;
const ProdutoModel_1 = require("../models/ProdutoModel");
const ApiError_1 = require("../utils/ApiError");
const EmpresaModel_1 = require("../models/EmpresaModel");
const MarcaModel_1 = require("../models/MarcaModel");
const ensureEmpresa = async (empresaId) => {
    const empresa = await EmpresaModel_1.EmpresaModel.findById(empresaId);
    if (!empresa) {
        throw ApiError_1.ApiError.notFound('Empresa relacionada não encontrada');
    }
};
const ensureMarca = async (marcaId) => {
    if (!marcaId) {
        return;
    }
    const marca = await MarcaModel_1.MarcaModel.findById(marcaId);
    if (!marca) {
        throw ApiError_1.ApiError.notFound('Marca relacionada não encontrada');
    }
};
const buildProdutoDetalhado = async (produto) => {
    const [marca, empresa] = await Promise.all([
        produto.IdMarca ? MarcaModel_1.MarcaModel.findById(produto.IdMarca) : Promise.resolve(null),
        EmpresaModel_1.EmpresaModel.findById(produto.IdEmpresa),
    ]);
    return {
        ...produto,
        MarcaInfo: marca ?? null,
        EmpresaNome: empresa?.RazaoSocial ?? null,
    };
};
exports.ProdutoService = {
    async create(data) {
        if (!data.IdEmpresa) {
            throw ApiError_1.ApiError.badRequest('Esse produto precisa estar associado a uma empresa');
        }
        await ensureEmpresa(data.IdEmpresa);
        await ensureMarca(data.IdMarca);
        const produto = await ProdutoModel_1.ProdutoModel.create(data);
        return buildProdutoDetalhado(produto);
    },
    async list() {
        const produtos = await ProdutoModel_1.ProdutoModel.findAll();
        return Promise.all(produtos.map((produto) => buildProdutoDetalhado(produto)));
    },
    async findById(id) {
        const produto = await ProdutoModel_1.ProdutoModel.findById(id);
        if (!produto) {
            throw ApiError_1.ApiError.notFound('Produto não encontrado');
        }
        return buildProdutoDetalhado(produto);
    },
    async update(id, data) {
        if (data.IdEmpresa) {
            await ensureEmpresa(data.IdEmpresa);
        }
        if (data.IdMarca !== undefined) {
            await ensureMarca(data.IdMarca ?? null);
        }
        const produto = await ProdutoModel_1.ProdutoModel.update(id, {
            ...data,
            DataAtualizacao: data.DataAtualizacao ?? new Date(),
        });
        if (!produto) {
            throw ApiError_1.ApiError.notFound('Produto não encontrado');
        }
        return buildProdutoDetalhado(produto);
    },
    async remove(id) {
        const deleted = await ProdutoModel_1.ProdutoModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Produto não encontrado');
        }
    },
};
//# sourceMappingURL=ProdutoService.js.map