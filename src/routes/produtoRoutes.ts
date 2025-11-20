import { Router } from 'express';
import multer from 'multer';
import { ProdutoController } from '../controllers/ProdutoController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gestao de produtos
 *
 * components:
 *   schemas:
 *     Imagem:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         UrlImg:
 *           type: string
 *         Descricao:
 *           type: string
 *           nullable: true
 *         IdProduto:
 *           type: integer
 *         CriadoEm:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     Produto:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         CodigoInterno:
 *           type: string
 *         NomeProduto:
 *           type: string
 *         Descricao:
 *           type: string
 *           nullable: true
 *         Genero:
 *           type: string
 *           description: "Exemplo: Masculino, Feminino, Unissex"
 *         Estilo:
 *           type: string
 *         Modelo:
 *           type: string
 *         Composicao:
 *           type: string
 *         Peso:
 *           type: number
 *           format: float
 *           description: "Peso em kg"
 *         Altura:
 *           type: number
 *           format: float
 *           description: "Altura em cm"
 *         Largura:
 *           type: number
 *           format: float
 *           description: "Largura em cm"
 *         Tags:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - 'basica'
 *             - 'verao'
 *         Ativo:
 *           type: boolean
 *         DataCriacao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         DataAtualizacao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         CurtidasTotal:
 *           type: integer
 *         UltimaCurtidaEm:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *         IdEmpresa:
 *           type: integer
 *         IdMarca:
 *           type: integer
 *           nullable: true
 *           description: "Opcional. Informe para associar uma marca existente."
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *     ProdutoDetalhado:
 *       allOf:
 *         - $ref: '#/components/schemas/Produto'
 *       properties:
 *         MarcaInfo:
 *           $ref: '#/components/schemas/Marca'
 *           nullable: true
 *         EmpresaNome:
 *           type: string
 *           nullable: true
 *           description: "Nome da empresa associada ao produto"
 *         Imagens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Imagem'
 *     ProdutoResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ProdutoDetalhado'
 *     ProdutoListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProdutoDetalhado'
 */

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoInterno:
 *                 type: string
 *               NomeProduto:
 *                 type: string
 *               Descricao:
 *                 type: string
 *                 nullable: true
 *               Genero:
 *                 type: string
 *               Estilo:
 *                 type: string
 *               Modelo:
 *                 type: string
 *               Composicao:
 *                 type: string
 *               Peso:
 *                 type: number
 *                 format: float
 *               Altura:
 *                 type: number
 *                 format: float
 *               Largura:
 *                 type: number
 *                 format: float
 *               Tags:
 *                 type: string
 *                 description: "JSON array de tags. Ex: ['basica','verao']"
 *               IdEmpresa:
 *                 type: integer
 *               IdMarca:
 *                 type: integer
 *                 nullable: true
 *               Imagens:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Envie um ou mais arquivos com o campo Imagens"
 *               ImagensMetadata:
 *                 type: string
 *                 nullable: true
 *                 description: "Opcional: JSON array com descricoes [{\"Descricao\":\"frente\"},{\"Descricao\":\"costas\"}]"
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 */
router.post('/', upload.array('Imagens'), ProdutoController.create);

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Listar produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoListResponse'
 */
router.get('/', ProdutoController.list);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 *       404:
 *         description: Produto nao encontrado
 */
router.get('/:id', ProdutoController.findById);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 */
router.put('/:id', ProdutoController.update);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remover produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.delete('/:id', ProdutoController.remove);

export const produtoRoutes = router;
