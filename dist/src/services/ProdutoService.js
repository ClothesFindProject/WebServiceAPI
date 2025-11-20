"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoService = void 0;
const ProdutoModel_1 = require("../models/ProdutoModel");
const ApiError_1 = require("../utils/ApiError");
const EmpresaModel_1 = require("../models/EmpresaModel");
const MarcaModel_1 = require("../models/MarcaModel");
const ImagemModel_1 = require("../models/ImagemModel");
const cloudflare_1 = require("../config/cloudflare");
const ensureEmpresa = async (empresaId) => {
    const empresa = await EmpresaModel_1.EmpresaModel.findById(empresaId);
    if (!empresa) {
        throw ApiError_1.ApiError.notFound('Empresa relacionada não encontrada');
    }
};
const ensureMarca = async (marcaId) => {
    if (!marcaId) {
        return;
    }
    const marca = await MarcaModel_1.MarcaModel.findById(marcaId);
    if (!marca) {
        throw ApiError_1.ApiError.notFound('Marca relacionada não encontrada');
    }
};
const buildProdutoDetalhado = async (produto) => {
    const [marca, empresa, imagens] = await Promise.all([
        produto.IdMarca ? MarcaModel_1.MarcaModel.findById(produto.IdMarca) : Promise.resolve(null),
        EmpresaModel_1.EmpresaModel.findById(produto.IdEmpresa),
        ImagemModel_1.ImagemModel.findByProdutoId(produto.Id),
    ]);
    return {
        ...produto,
        MarcaInfo: marca ?? null,
        EmpresaNome: empresa?.RazaoSocial ?? null,
        Imagens: imagens ?? [],
    };
};
exports.ProdutoService = {
    async create(data, files) {
        if (!data.IdEmpresa) {
            throw ApiError_1.ApiError.badRequest('Esse produto precisa estar associado a uma empresa');
        }
        await ensureEmpresa(data.IdEmpresa);
        await ensureMarca(data.IdMarca);
        const produto = await ProdutoModel_1.ProdutoModel.create(data);
        // cria imagens vinculadas ao produto recem criado
        const imagensMeta = data.Imagens ?? [];
        const imagensPayload = files && files.length > 0
            ? files.map((file, idx) => ({ file, data: imagensMeta[idx] }))
            : imagensMeta.map((img) => ({ data: img }));
        if (imagensPayload.length > 0) {
            await Promise.all(imagensPayload.map(async ({ file, data: img }) => {
                let urlImg = img?.UrlImg;
                if (file) {
                    urlImg = await (0, cloudflare_1.uploadImagemProduto)(file);
                }
                if (!urlImg)
                    return;
                const payload = {
                    UrlImg: urlImg,
                    Descricao: img?.Descricao ?? null,
                    IdProduto: produto.Id,
                };
                await ImagemModel_1.ImagemModel.create(payload);
            }));
        }
        return buildProdutoDetalhado(produto);
    },
    async list() {
        const produtos = await ProdutoModel_1.ProdutoModel.findAll();
        return Promise.all(produtos.map((produto) => buildProdutoDetalhado(produto)));
    },
    async findById(id) {
        const produto = await ProdutoModel_1.ProdutoModel.findById(id);
        if (!produto) {
            throw ApiError_1.ApiError.notFound('Produto não encontrado');
        }
        return buildProdutoDetalhado(produto);
    },
    async update(id, data) {
        if (data.IdEmpresa) {
            await ensureEmpresa(data.IdEmpresa);
        }
        if (data.IdMarca !== undefined) {
            await ensureMarca(data.IdMarca ?? null);
        }
        const produto = await ProdutoModel_1.ProdutoModel.update(id, {
            ...data,
            DataAtualizacao: data.DataAtualizacao ?? new Date(),
        });
        if (!produto) {
            throw ApiError_1.ApiError.notFound('Produto não encontrado');
        }
        return buildProdutoDetalhado(produto);
    },
    async remove(id) {
        const deleted = await ProdutoModel_1.ProdutoModel.remove(id);
        if (!deleted) {
            throw ApiError_1.ApiError.notFound('Produto não encontrado');
        }
    },
};
//# sourceMappingURL=ProdutoService.js.map