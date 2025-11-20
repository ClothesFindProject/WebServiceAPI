import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_PUBLIC_BASE_URL = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');

export const s3Client = new S3Client({
  endpoint: R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const buildKey = (prefix: string, originalname: string) => {
  const sanitizedName = originalname.replace(/\s+/g, '-');
  return `${prefix}/${Date.now()}-${sanitizedName}`;
};

const uploadToR2 = async (file: any, key: string): Promise<string> => {
  if (!file) {
    throw new Error('Arquivo nao informado');
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return `${R2_PUBLIC_BASE_URL}/${key}`;
};

export const uploadLogoEmpresa = async (file: any): Promise<string> => {
  const key = buildKey('empresas/logos', file.originalname);
  return uploadToR2(file, key);
};

export const uploadUsuarioImagem = async (file: any): Promise<string> => {
  const key = buildKey('usuarios/imagens', file.originalname);
  return uploadToR2(file, key);
};

export const uploadImagemProduto = async (file: any): Promise<string> => {
  const key = buildKey('produtos/imagens', file.originalname);
  return uploadToR2(file, key);
};

export const uploadImagemMarca = async (file: any): Promise<string> => {
  const key = buildKey('marcas/imagens', file.originalname);
  return uploadToR2(file, key);
};
