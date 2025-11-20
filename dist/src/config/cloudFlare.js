"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagemMarca = exports.uploadImagemProduto = exports.uploadUsuarioImagem = exports.uploadLogoEmpresa = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_PUBLIC_BASE_URL = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
exports.s3Client = new client_s3_1.S3Client({
    endpoint: R2_ENDPOINT,
    region: 'auto',
    forcePathStyle: true,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});
const buildKey = (prefix, originalname) => {
    const sanitizedName = originalname.replace(/\s+/g, '-');
    return `${prefix}/${Date.now()}-${sanitizedName}`;
};
const uploadToR2 = async (file, key) => {
    if (!file) {
        throw new Error('Arquivo nao informado');
    }
    await exports.s3Client.send(new client_s3_1.PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));
    return `${R2_PUBLIC_BASE_URL}/${key}`;
};
const uploadLogoEmpresa = async (file) => {
    const key = buildKey('empresas/logos', file.originalname);
    return uploadToR2(file, key);
};
exports.uploadLogoEmpresa = uploadLogoEmpresa;
const uploadUsuarioImagem = async (file) => {
    const key = buildKey('usuarios/imagens', file.originalname);
    return uploadToR2(file, key);
};
exports.uploadUsuarioImagem = uploadUsuarioImagem;
const uploadImagemProduto = async (file) => {
    const key = buildKey('produtos/imagens', file.originalname);
    return uploadToR2(file, key);
};
exports.uploadImagemProduto = uploadImagemProduto;
const uploadImagemMarca = async (file) => {
    const key = buildKey('marcas/imagens', file.originalname);
    return uploadToR2(file, key);
};
exports.uploadImagemMarca = uploadImagemMarca;
//# sourceMappingURL=cloudflare.js.map