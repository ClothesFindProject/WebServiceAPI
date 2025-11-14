"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurtidaLojaService = void 0;
const CurtidaLojaModel_1 = require("../models/CurtidaLojaModel");
const UsuarioModel_1 = require("../models/UsuarioModel");
const EmpresaModel_1 = require("../models/EmpresaModel");
const ApiError_1 = require("../utils/ApiError");
const ensureRelacionamentos = async (usuarioId, empresaId) => {
    const [usuario, empresa] = await Promise.all([UsuarioModel_1.UsuarioModel.findById(usuarioId), EmpresaModel_1.EmpresaModel.findById(empresaId)]);
    if (!usuario) {
        throw ApiError_1.ApiError.notFound('Usuário relacionado não encontrado');
    }
    if (!empresa) {
        throw ApiError_1.ApiError.notFound('Empresa relacionada não encontrada');
    }
};
exports.CurtidaLojaService = {
    async create(data) {
        await ensureRelacionamentos(data.IdUsuario, data.IdEmpresa);
        return CurtidaLojaModel_1.CurtidaLojaModel.create(data);
    },
    async list(filters) {
        if (filters?.usuarioId) {
            return CurtidaLojaModel_1.CurtidaLojaModel.findByUsuario(filters.usuarioId);
        }
        if (filters?.empresaId) {
            return CurtidaLojaModel_1.CurtidaLojaModel.findByEmpresa(filters.empresaId);
        }
        return CurtidaLojaModel_1.CurtidaLojaModel.findAll();
    },
    async findById(id) {
        const curtida = await CurtidaLojaModel_1.CurtidaLojaModel.findById(id);
        if (!curtida) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
        return curtida;
    },
    async update(id, data) {
        if (data.IdUsuario || data.IdEmpresa) {
            const existing = await CurtidaLojaModel_1.CurtidaLojaModel.findById(id);
            if (!existing) {
                throw ApiError_1.ApiError.notFound('Curtida não encontrada');
            }
            await ensureRelacionamentos(data.IdUsuario ?? existing.IdUsuario, data.IdEmpresa ?? existing.IdEmpresa);
        }
        const curtida = await CurtidaLojaModel_1.CurtidaLojaModel.update(id, data);
        if (!curtida) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
        return curtida;
    },
    async remove(id) {
        const deleted = await CurtidaLojaModel_1.CurtidaLojaModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
    },
    async validateCurtida(usuarioId, empresaId) {
        const curtida = await CurtidaLojaModel_1.CurtidaLojaModel.findByUsuarioEmpresa(usuarioId, empresaId);
        return {
            existe: Boolean(curtida),
            ativo: curtida?.Ativo ?? false,
        };
    },
    async deactivateCurtida(usuarioId, empresaId) {
        const curtida = await CurtidaLojaModel_1.CurtidaLojaModel.findByUsuarioEmpresa(usuarioId, empresaId);
        if (!curtida) {
            throw ApiError_1.ApiError.notFound('Curtida não encontrada');
        }
        if (!curtida.Ativo) {
            return curtida;
        }
        await CurtidaLojaModel_1.CurtidaLojaModel.setAtivoByUsuarioEmpresa(usuarioId, empresaId, false);
        return {
            ...curtida,
            Ativo: false,
        };
    },
    async listEmpresasCurtidas(usuarioId) {
        const curtidas = await CurtidaLojaModel_1.CurtidaLojaModel.findByUsuario(usuarioId);
        const empresaIds = curtidas.filter((c) => c.Ativo).map((c) => c.IdEmpresa);
        const empresas = await Promise.all(empresaIds.map((id) => EmpresaModel_1.EmpresaModel.findById(id)));
        return empresas.filter((empresa) => Boolean(empresa));
    },
};
//# sourceMappingURL=CurtidaLojaService.js.map