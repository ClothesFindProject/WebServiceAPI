"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagemService = void 0;
const ImagemModel_1 = require("../models/ImagemModel");
const ProdutoModel_1 = require("../models/ProdutoModel");
const ApiError_1 = require("../utils/ApiError");
const cloudflare_1 = require("../config/cloudflare");
exports.ImagemService = {
    async create(data, file) {
        const produto = await ProdutoModel_1.ProdutoModel.findById(data.IdProduto);
        if (!produto) {
            throw ApiError_1.ApiError.notFound('Produto relacionado nǜo encontrado');
        }
        const url = file ? await (0, cloudflare_1.uploadImagemProduto)(file) : data.UrlImg;
        return ImagemModel_1.ImagemModel.create({
            ...data,
            UrlImg: url,
        });
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
            throw ApiError_1.ApiError.notFound('Imagem nǜo encontrada');
        }
        return imagem;
    },
    async update(id, data) {
        if (data.IdProduto) {
            const produto = await ProdutoModel_1.ProdutoModel.findById(data.IdProduto);
            if (!produto) {
                throw ApiError_1.ApiError.notFound('Produto relacionado nǜo encontrado');
            }
        }
        const imagem = await ImagemModel_1.ImagemModel.update(id, data);
        if (!imagem) {
            throw ApiError_1.ApiError.notFound('Imagem nǜo encontrada');
        }
        return imagem;
    },
    async remove(id) {
        const deleted = await ImagemModel_1.ImagemModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Imagem nǜo encontrada');
        }
    },
};
//# sourceMappingURL=ImagemService.js.map