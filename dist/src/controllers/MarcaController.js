"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaController = void 0;
const MarcaService_1 = require("../services/MarcaService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.MarcaController = {
    async create(req, res, next) {
        try {
            const file = req.file;
            const marca = await MarcaService_1.MarcaService.create(req.body, file);
            sendSuccess(res, 201, 'Marca criada com sucesso.', marca);
        }
        catch (error) {
            next(error);
        }
    },
    async list(_req, res, next) {
        try {
            const marcas = await MarcaService_1.MarcaService.list();
            sendSuccess(res, 200, 'Marcas listadas com sucesso.', marcas);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const marca = await MarcaService_1.MarcaService.findById(id);
            sendSuccess(res, 200, 'Marca encontrada com sucesso.', marca);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const file = req.file;
            const marca = await MarcaService_1.MarcaService.update(id, req.body, file);
            sendSuccess(res, 200, 'Marca atualizada com sucesso.', marca);
        }
        catch (error) {
            next(error);
        }
    },
    async changeStatus(req, res, next) {
        try {
            const id = Number(req.params.id);
            const { Ativo } = req.body;
            const marca = await MarcaService_1.MarcaService.changeStatus(id, Ativo);
            sendSuccess(res, 200, 'Status da marca atualizado com sucesso.', marca);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await MarcaService_1.MarcaService.remove(id);
            sendSuccess(res, 200, 'Marca removida com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=MarcaController.js.map