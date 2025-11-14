"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaService = void 0;
const MarcaModel_1 = require("../models/MarcaModel");
const ApiError_1 = require("../utils/ApiError");
exports.MarcaService = {
    async create(data) {
        return MarcaModel_1.MarcaModel.create(data);
    },
    async list() {
        return MarcaModel_1.MarcaModel.findAll();
    },
    async findById(id) {
        const marca = await MarcaModel_1.MarcaModel.findById(id);
        if (!marca) {
            throw ApiError_1.ApiError.notFound('Marca não encontrada');
        }
        return marca;
    },
    async update(id, data) {
        const marca = await MarcaModel_1.MarcaModel.update(id, data);
        if (!marca) {
            throw ApiError_1.ApiError.notFound('Marca não encontrada');
        }
        return marca;
    },
    async remove(id) {
        const deleted = await MarcaModel_1.MarcaModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Marca não encontrada');
        }
    },
};
//# sourceMappingURL=MarcaService.js.map