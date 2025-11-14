import { Router } from 'express';
import { ImagemController } from '../controllers/ImagemController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Imagens
 *   description: Gestão de imagens de produtos
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
 *         CriadoEm:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         IdProduto:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *     ImagemResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Imagem'
 *     ImagemListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Imagem'
 */

/**
 * @swagger
 * /api/imagens:
 *   post:
 *     summary: Cadastrar imagem
 *     tags: [Imagens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Imagem'
 *     responses:
 *       201:
 *         description: Imagem criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagemResponse'
 */
router.post('/', ImagemController.create);

/**
 * @swagger
 * /api/imagens:
 *   get:
 *     summary: Listar imagens
 *     tags: [Imagens]
 *     parameters:
 *       - in: query
 *         name: produtoId
 *         schema:
 *           type: integer
 *         description: Filtra imagens pelo produto
 *     responses:
 *       200:
 *         description: Lista de imagens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagemListResponse'
 */
router.get('/', ImagemController.list);

/**
 * @swagger
 * /api/imagens/{id}:
 *   get:
 *     summary: Buscar imagem por ID
 *     tags: [Imagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagem encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagemResponse'
 *       404:
 *         description: Imagem não encontrada
 */
router.get('/:id', ImagemController.findById);

/**
 * @swagger
 * /api/imagens/{id}:
 *   put:
 *     summary: Atualizar imagem
 *     tags: [Imagens]
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
 *             $ref: '#/components/schemas/Imagem'
 *     responses:
 *       200:
 *         description: Imagem atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagemResponse'
 */
router.put('/:id', ImagemController.update);

/**
 * @swagger
 * /api/imagens/{id}:
 *   delete:
 *     summary: Remover imagem
 *     tags: [Imagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagem removida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.delete('/:id', ImagemController.remove);

export const imagemRoutes = router;
