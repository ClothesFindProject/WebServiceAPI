"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaController = void 0;
const EmpresaService_1 = require("../services/EmpresaService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.EmpresaController = {
    async create(req, res, next) {
        try {
            const file = req.file;
            const empresa = await EmpresaService_1.EmpresaService.create(req.body, file);
            sendSuccess(res, 201, 'Empresa criada com sucesso.', empresa);
        }
        catch (error) {
            next(error);
        }
    },
    async list(_req, res, next) {
        try {
            const empresas = await EmpresaService_1.EmpresaService.list();
            sendSuccess(res, 200, 'Empresas listadas com sucesso.', empresas);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const empresa = await EmpresaService_1.EmpresaService.findById(id);
            sendSuccess(res, 200, 'Empresa recuperada com sucesso.', empresa);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const empresa = await EmpresaService_1.EmpresaService.update(id, req.body);
            sendSuccess(res, 200, 'Empresa atualizada com sucesso.', empresa);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await EmpresaService_1.EmpresaService.remove(id);
            sendSuccess(res, 200, 'Empresa removida com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
    async associateUsuario(req, res, next) {
        try {
            const empresaId = Number(req.params.id);
            const { usuarioId } = req.body;
            if (!usuarioId) {
                return res.status(400).json({ message: 'usuarioId é obrigatório' });
            }
            const result = await EmpresaService_1.EmpresaService.associateUsuario(empresaId, usuarioId);
            return sendSuccess(res, 200, 'Usuário associado à empresa com sucesso.', result);
        }
        catch (error) {
            next(error);
            return undefined;
        }
    },
};
//# sourceMappingURL=EmpresaController.js.map