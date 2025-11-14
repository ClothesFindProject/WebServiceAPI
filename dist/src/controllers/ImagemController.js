"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagemController = void 0;
const ImagemService_1 = require("../services/ImagemService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.ImagemController = {
    async create(req, res, next) {
        try {
            const imagem = await ImagemService_1.ImagemService.create(req.body);
            sendSuccess(res, 201, 'Imagem cadastrada com sucesso.', imagem);
        }
        catch (error) {
            next(error);
        }
    },
    async list(req, res, next) {
        try {
            const produtoId = req.query.produtoId ? Number(req.query.produtoId) : undefined;
            const imagens = await ImagemService_1.ImagemService.list(produtoId);
            sendSuccess(res, 200, 'Imagens listadas com sucesso.', imagens);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const imagem = await ImagemService_1.ImagemService.findById(id);
            sendSuccess(res, 200, 'Imagem encontrada com sucesso.', imagem);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const imagem = await ImagemService_1.ImagemService.update(id, req.body);
            sendSuccess(res, 200, 'Imagem atualizada com sucesso.', imagem);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await ImagemService_1.ImagemService.remove(id);
            sendSuccess(res, 200, 'Imagem removida com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=ImagemController.js.map