"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const ProdutoService_1 = require("../services/ProdutoService");
const sendSuccess = (res, status, message, data) => res.status(status).json({ message, data });
exports.ProdutoController = {
    async create(req, res, next) {
        try {
            const files = req.files;
            const body = { ...req.body };
            // normaliza campos do body (multipart vem como string)
            if (typeof body.Tags === 'string') {
                try {
                    body.Tags = JSON.parse(body.Tags);
                }
                catch {
                    body.Tags = body.Tags.split(',').map((t) => t.trim()).filter(Boolean);
                }
            }
            if (typeof body.IdEmpresa === 'string')
                body.IdEmpresa = Number(body.IdEmpresa);
            if (typeof body.IdMarca === 'string' && body.IdMarca !== '')
                body.IdMarca = Number(body.IdMarca);
            // metadados opcionais das imagens (descricao)
            let imagensMeta = [];
            if (typeof body.ImagensMetadata === 'string') {
                try {
                    const parsed = JSON.parse(body.ImagensMetadata);
                    if (Array.isArray(parsed)) {
                        imagensMeta = parsed.map((item) => ({
                            Descricao: item?.Descricao ?? null,
                        }));
                    }
                }
                catch {
                    imagensMeta = [];
                }
            }
            body.Imagens = imagensMeta;
            delete body.ImagensMetadata;
            const produto = await ProdutoService_1.ProdutoService.create(body, files);
            sendSuccess(res, 201, 'Produto criado com sucesso.', produto);
        }
        catch (error) {
            next(error);
        }
    },
    async list(_req, res, next) {
        try {
            const produtos = await ProdutoService_1.ProdutoService.list();
            sendSuccess(res, 200, 'Produtos listados com sucesso.', produtos);
        }
        catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const produto = await ProdutoService_1.ProdutoService.findById(id);
            sendSuccess(res, 200, 'Produto encontrado com sucesso.', produto);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const produto = await ProdutoService_1.ProdutoService.update(id, req.body);
            sendSuccess(res, 200, 'Produto atualizado com sucesso.', produto);
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            await ProdutoService_1.ProdutoService.remove(id);
            sendSuccess(res, 200, 'Produto removido com sucesso.');
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=ProdutoController.js.map