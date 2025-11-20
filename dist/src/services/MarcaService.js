"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaService = void 0;
const MarcaModel_1 = require("../models/MarcaModel");
const ApiError_1 = require("../utils/ApiError");
const cloudflare_1 = require("../config/cloudflare");
exports.MarcaService = {
    async create(data, file) {
        const imgUrl = file ? await (0, cloudflare_1.uploadImagemMarca)(file) : data.ImgMarca ?? null;
        return MarcaModel_1.MarcaModel.create({
            ...data,
            ImgMarca: imgUrl,
        });
    },
    async list() {
        return MarcaModel_1.MarcaModel.findAll();
    },
    async findById(id) {
        const marca = await MarcaModel_1.MarcaModel.findById(id);
        if (!marca) {
            throw ApiError_1.ApiError.notFound('Marca nǜo encontrada');
        }
        return marca;
    },
    async update(id, data, file) {
        const imgUrl = file ? await (0, cloudflare_1.uploadImagemMarca)(file) : data.ImgMarca ?? null;
        const marca = await MarcaModel_1.MarcaModel.update(id, {
            ...data,
            ImgMarca: imgUrl,
        });
        if (!marca) {
            throw ApiError_1.ApiError.notFound('Marca nǜo encontrada');
        }
        return marca;
    },
    async changeStatus(id, ativo) {
        const parsedAtivo = typeof ativo === 'string' ? ['true', '1', 'yes', 'on'].includes(ativo.toLowerCase()) : Boolean(ativo);
        const marca = await MarcaModel_1.MarcaModel.update(id, { Ativo: parsedAtivo });
        if (!marca) {
            throw ApiError_1.ApiError.notFound('Marca nǜo encontrada');
        }
        return marca;
    },
    async remove(id) {
        const deleted = await MarcaModel_1.MarcaModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Marca nǜo encontrada');
        }
    },
};
//# sourceMappingURL=MarcaService.js.map