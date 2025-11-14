"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const ProdutoService_1 = require("../services/ProdutoService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.ProdutoController = {
    async create(req, res, next) {
        try {
            const produto = await ProdutoService_1.ProdutoService.create(req.body);
            sendSuccess(res, 201, 'Produto criado com sucesso.', produto);
        }
        catch (error) {
            next(error);
        }
    },
    async list(_req, res, next) {
        try {
            const produtos = await ProdutoService_1.ProdutoService.list();
            sendSuccess(res, 200, 'Produtos listados com sucesso.', produtos);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const produto = await ProdutoService_1.ProdutoService.findById(id);
            sendSuccess(res, 200, 'Produto encontrado com sucesso.', produto);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const produto = await ProdutoService_1.ProdutoService.update(id, req.body);
            sendSuccess(res, 200, 'Produto atualizado com sucesso.', produto);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await ProdutoService_1.ProdutoService.remove(id);
            sendSuccess(res, 200, 'Produto removido com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=ProdutoController.js.map