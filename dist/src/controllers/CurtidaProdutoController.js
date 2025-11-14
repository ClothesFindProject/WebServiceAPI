"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurtidaProdutoController = void 0;
const CurtidaProdutoService_1 = require("../services/CurtidaProdutoService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.CurtidaProdutoController = {
    async create(req, res, next) {
        try {
            const curtida = await CurtidaProdutoService_1.CurtidaProdutoService.create(req.body);
            sendSuccess(res, 201, 'Curtida de produto registrada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async list(req, res, next) {
        try {
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
            const produtoId = req.query.produtoId ? Number(req.query.produtoId) : undefined;
            const curtidas = await CurtidaProdutoService_1.CurtidaProdutoService.list({ usuarioId, produtoId });
            sendSuccess(res, 200, 'Curtidas de produtos listadas com sucesso.', curtidas);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const curtida = await CurtidaProdutoService_1.CurtidaProdutoService.findById(id);
            sendSuccess(res, 200, 'Curtida de produto encontrada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const curtida = await CurtidaProdutoService_1.CurtidaProdutoService.update(id, req.body);
            sendSuccess(res, 200, 'Curtida de produto atualizada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await CurtidaProdutoService_1.CurtidaProdutoService.remove(id);
            sendSuccess(res, 200, 'Curtida de produto removida com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
    async validate(req, res, next) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const produtoId = Number(req.params.idProduto);
            const resultado = await CurtidaProdutoService_1.CurtidaProdutoService.validateCurtida(usuarioId, produtoId);
            sendSuccess(res, 200, 'Validação realizada com sucesso.', resultado);
        }
        catch (error) {
            next(error);
        }
    },
    async deactivate(req, res, next) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const produtoId = Number(req.params.idProduto);
            const curtida = await CurtidaProdutoService_1.CurtidaProdutoService.deactivateCurtida(usuarioId, produtoId);
            sendSuccess(res, 200, 'Curtida de produto desativada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async listProdutosCurtidos(req, res, next) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const produtos = await CurtidaProdutoService_1.CurtidaProdutoService.listProdutosCurtidos(usuarioId);
            sendSuccess(res, 200, 'Produtos curtidos retornados com sucesso.', produtos);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=CurtidaProdutoController.js.map