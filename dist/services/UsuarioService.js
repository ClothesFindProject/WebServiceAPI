"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsuarioModel_1 = require("../models/UsuarioModel");
const MenuModel_1 = require("../models/MenuModel");
const password_1 = require("../utils/password");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const sanitizeUsuario = (usuario) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Senha, ...rest } = usuario;
    return rest;
};
const buildUsuarioWithMenu = async (usuario) => {
    const menu = usuario.IdMenu ? await MenuModel_1.MenuModel.findMenuTreeById(usuario.IdMenu) : null;
    return {
        usuario: sanitizeUsuario(usuario),
        menu,
    };
};
exports.UsuarioService = {
    async register(data) {
        const existing = await UsuarioModel_1.UsuarioModel.findByCpfCnpj(data.CpfCnpj);
        if (existing) {
            throw ApiError_1.ApiError.badRequest('Usuário já existe para este CPF/CNPJ');
        }
        const senhaHash = await (0, password_1.hashPassword)(data.Senha);
        const usuarioCriado = await UsuarioModel_1.UsuarioModel.create({
            ...data,
            Senha: senhaHash,
            Ativo: data.Ativo ?? true,
        });
        return sanitizeUsuario(usuarioCriado);
    },
    async login({ CpfCnpj, Senha }) {
        const usuario = await UsuarioModel_1.UsuarioModel.findByCpfCnpj(CpfCnpj);
        if (!usuario?.Senha) {
            throw ApiError_1.ApiError.unauthorized('Credenciais inválidas');
        }
        const senhaValida = await (0, password_1.comparePassword)(Senha, usuario.Senha);
        if (!senhaValida) {
            throw ApiError_1.ApiError.unauthorized('Credenciais inválidas');
        }
        const token = jsonwebtoken_1.default.sign({
            sub: usuario.Id,
            Nome: usuario.Nome,
            CpfCnpj: usuario.CpfCnpj,
        }, env_1.env.jwtSecret, { expiresIn: '1h' });
        const usuarioComMenu = await buildUsuarioWithMenu(usuario);
        return {
            token,
            ...usuarioComMenu,
        };
    },
    async findAll() {
        const usuarios = await UsuarioModel_1.UsuarioModel.findAll();
        return Promise.all(usuarios.map((usuario) => buildUsuarioWithMenu(usuario)));
    },
    async findById(id) {
        const usuario = await UsuarioModel_1.UsuarioModel.findById(id);
        if (!usuario) {
            throw ApiError_1.ApiError.notFound('Usuário não encontrado');
        }
        return buildUsuarioWithMenu(usuario);
    },
    async update(id, data) {
        const payload = { ...data };
        if (data.Senha) {
            payload.Senha = await (0, password_1.hashPassword)(data.Senha);
        }
        const updated = await UsuarioModel_1.UsuarioModel.update(id, payload);
        if (!updated) {
            throw ApiError_1.ApiError.notFound('Usuário não encontrado');
        }
        return sanitizeUsuario(updated);
    },
    async remove(id) {
        const deleted = await UsuarioModel_1.UsuarioModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Usuário não encontrado');
        }
    },
};
//# sourceMappingURL=UsuarioService.js.map