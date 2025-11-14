"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurtidaLojaController = void 0;
const CurtidaLojaService_1 = require("../services/CurtidaLojaService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.CurtidaLojaController = {
    async create(req, res, next) {
        try {
            const curtida = await CurtidaLojaService_1.CurtidaLojaService.create(req.body);
            sendSuccess(res, 201, 'Curtida registrada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async list(req, res, next) {
        try {
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
            const empresaId = req.query.empresaId ? Number(req.query.empresaId) : undefined;
            const curtidas = await CurtidaLojaService_1.CurtidaLojaService.list({ usuarioId, empresaId });
            sendSuccess(res, 200, 'Curtidas listadas com sucesso.', curtidas);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const curtida = await CurtidaLojaService_1.CurtidaLojaService.findById(id);
            sendSuccess(res, 200, 'Curtida encontrada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const curtida = await CurtidaLojaService_1.CurtidaLojaService.update(id, req.body);
            sendSuccess(res, 200, 'Curtida atualizada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await CurtidaLojaService_1.CurtidaLojaService.remove(id);
            sendSuccess(res, 200, 'Curtida removida com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
    async validate(req, res, next) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const empresaId = Number(req.params.idEmpresa);
            const resultado = await CurtidaLojaService_1.CurtidaLojaService.validateCurtida(usuarioId, empresaId);
            sendSuccess(res, 200, 'Validação realizada com sucesso.', resultado);
        }
        catch (error) {
            next(error);
        }
    },
    async deactivate(req, res, next) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const empresaId = Number(req.params.idEmpresa);
            const curtida = await CurtidaLojaService_1.CurtidaLojaService.deactivateCurtida(usuarioId, empresaId);
            sendSuccess(res, 200, 'Curtida desativada com sucesso.', curtida);
        }
        catch (error) {
            next(error);
        }
    },
    async listEmpresasCurtidas(req, res, next) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const empresas = await CurtidaLojaService_1.CurtidaLojaService.listEmpresasCurtidas(usuarioId);
            sendSuccess(res, 200, 'Empresas curtidas retornadas com sucesso.', empresas);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=CurtidaLojaController.js.map