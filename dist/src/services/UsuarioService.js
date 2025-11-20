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
const cloudflare_1 = require("../config/cloudflare");
const isValidCpfOrCnpj = (value) => {
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cpfPattern.test(value) || cnpjPattern.test(value);
};
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
        UserImagem: usuario.UserImagem ?? null,
    };
};
exports.UsuarioService = {
    async register(data, file) {
        if (!isValidCpfOrCnpj(data.CpfCnpj)) {
            throw ApiError_1.ApiError.badRequest('CPF ou CNPJ no formato errado');
        }
        const existing = await UsuarioModel_1.UsuarioModel.findByCpfCnpj(data.CpfCnpj);
        if (existing) {
            throw ApiError_1.ApiError.badRequest('Usuario ja existe para este CPF/CNPJ');
        }
        let userImagemUrl;
        if (file) {
            userImagemUrl = await (0, cloudflare_1.uploadUsuarioImagem)(file);
        }
        const senhaHash = await (0, password_1.hashPassword)(data.Senha);
        const usuarioCriado = await UsuarioModel_1.UsuarioModel.create({
            ...data,
            Senha: senhaHash,
            Ativo: data.Ativo ?? true,
            UserImagem: userImagemUrl ?? data.UserImagem ?? null,
        });
        return sanitizeUsuario(usuarioCriado);
    },
    async login({ CpfCnpj, Senha }) {
        const usuario = await UsuarioModel_1.UsuarioModel.findByCpfCnpj(CpfCnpj);
        if (!usuario?.Senha) {
            throw ApiError_1.ApiError.unauthorized('Credenciais invalidas');
        }
        if (!usuario.Ativo) {
            throw ApiError_1.ApiError.unauthorized('Usuario inativo, entre em contato com o administrador');
        }
        const senhaValida = await (0, password_1.comparePassword)(Senha, usuario.Senha);
        if (!senhaValida) {
            throw ApiError_1.ApiError.unauthorized('Credenciais invalidas');
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
            throw ApiError_1.ApiError.notFound('Usuario nao encontrado');
        }
        return buildUsuarioWithMenu(usuario);
    },
    async update(id, data, file) {
        const payload = { ...data };
        if (file) {
            payload.UserImagem = await (0, cloudflare_1.uploadUsuarioImagem)(file);
        }
        if (data.Senha) {
            payload.Senha = await (0, password_1.hashPassword)(data.Senha);
        }
        const updated = await UsuarioModel_1.UsuarioModel.update(id, payload);
        if (!updated) {
            throw ApiError_1.ApiError.notFound('Usuario nao encontrado');
        }
        return sanitizeUsuario(updated);
    },
    async remove(id) {
        const deleted = await UsuarioModel_1.UsuarioModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Usuario nao encontrado');
        }
    },
    async changeStatus(id, ativo) {
        const parsedAtivo = typeof ativo === 'string' ? ['true', '1', 'yes', 'on'].includes(ativo.toLowerCase()) : Boolean(ativo);
        const updated = await UsuarioModel_1.UsuarioModel.update(id, { Ativo: parsedAtivo });
        if (!updated) {
            throw ApiError_1.ApiError.notFound('Usuario nao encontrado');
        }
        return sanitizeUsuario(updated);
    },
};
//# sourceMappingURL=UsuarioService.js.map