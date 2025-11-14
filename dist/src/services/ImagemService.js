"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagemService = void 0;
const ImagemModel_1 = require("../models/ImagemModel");
const ProdutoModel_1 = require("../models/ProdutoModel");
const ApiError_1 = require("../utils/ApiError");
exports.ImagemService = {
    async create(data) {
        const produto = await ProdutoModel_1.ProdutoModel.findById(data.IdProduto);
        if (!produto) {
            throw ApiError_1.ApiError.notFound('Produto relacionado não encontrado');
        }
        return ImagemModel_1.ImagemModel.create(data);
    },
    async list(produtoId) {
        if (produtoId) {
            return ImagemModel_1.ImagemModel.findByProdutoId(produtoId);
        }
        return ImagemModel_1.ImagemModel.findAll();
    },
    async findById(id) {
        const imagem = await ImagemModel_1.ImagemModel.findById(id);
        if (!imagem) {
            throw ApiError_1.ApiError.notFound('Imagem não encontrada');
        }
        return imagem;
    },
    async update(id, data) {
        if (data.IdProduto) {
            const produto = await ProdutoModel_1.ProdutoModel.findById(data.IdProduto);
            if (!produto) {
                throw ApiError_1.ApiError.notFound('Produto relacionado não encontrado');
            }
        }
        const imagem = await ImagemModel_1.ImagemModel.update(id, data);
        if (!imagem) {
            throw ApiError_1.ApiError.notFound('Imagem não encontrada');
        }
        return imagem;
    },
    async remove(id) {
        const deleted = await ImagemModel_1.ImagemModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Imagem não encontrada');
        }
    },
};
//# sourceMappingURL=ImagemService.js.map