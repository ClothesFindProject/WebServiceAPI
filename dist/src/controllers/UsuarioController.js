"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioService_1 = require("../services/UsuarioService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.UsuarioController = {
    async register(req, res, next) {
        try {
            const file = req.file;
            const usuario = await UsuarioService_1.UsuarioService.register(req.body, file);
            sendSuccess(res, 201, 'Usuário criado com sucesso.', usuario);
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const resultado = await UsuarioService_1.UsuarioService.login(req.body);
            sendSuccess(res, 200, 'Login realizado com sucesso.', resultado);
        }
        catch (error) {
            next(error);
        }
    },
    async list(_req, res, next) {
        try {
            const usuarios = await UsuarioService_1.UsuarioService.findAll();
            sendSuccess(res, 200, 'Usuários listados com sucesso.', usuarios);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const usuario = await UsuarioService_1.UsuarioService.findById(id);
            sendSuccess(res, 200, 'Usuário recuperado com sucesso.', usuario);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const file = req.file;
            const usuario = await UsuarioService_1.UsuarioService.update(id, req.body, file);
            sendSuccess(res, 200, 'Usuário atualizado com sucesso.', usuario);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await UsuarioService_1.UsuarioService.remove(id);
            sendSuccess(res, 200, 'Usuário removido com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
    async changeStatus(req, res, next) {
        try {
            const id = Number(req.params.id);
            const { Ativo } = req.body;
            const usuario = await UsuarioService_1.UsuarioService.changeStatus(id, Ativo);
            sendSuccess(res, 200, 'Status do usuário atualizado com sucesso.', usuario);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=UsuarioController.js.map