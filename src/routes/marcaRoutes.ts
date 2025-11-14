import { Router } from 'express';
import { MarcaController } from '../controllers/MarcaController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestão de marcas
 *
 * components:
 *   schemas:
 *     Marca:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Nome:
 *           type: string
 *         Site:
 *           type: string
 *           nullable: true
 *         Ativo:
 *           type: boolean
 *         ImgMarca:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *     MarcaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Marca'
 *     MarcaListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Marca'
 */

/**
 * @swagger
 * /api/marcas:
 *   post:
 *     summary: Criar nova marca
 *     tags: [Marcas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Marca'
 *     responses:
 *       201:
 *         description: Marca criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaResponse'
 */
router.post('/', MarcaController.create);

/**
 * @swagger
 * /api/marcas:
 *   get:
 *     summary: Listar marcas
 *     tags: [Marcas]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaListResponse'
 */
router.get('/', MarcaController.list);

/**
 * @swagger
 * /api/marcas/{id}:
 *   get:
 *     summary: Buscar marca por ID
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaResponse'
 *       404:
 *         description: Marca não encontrada
 */
router.get('/:id', MarcaController.findById);

/**
 * @swagger
 * /api/marcas/{id}:
 *   put:
 *     summary: Atualizar marca
 *     tags: [Marcas]
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
 *             $ref: '#/components/schemas/Marca'
 *     responses:
 *       200:
 *         description: Marca atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaResponse'
 */
router.put('/:id', MarcaController.update);

/**
 * @swagger
 * /api/marcas/{id}:
 *   delete:
 *     summary: Remover marca
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca removida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.delete('/:id', MarcaController.remove);

export const marcaRoutes = router;
