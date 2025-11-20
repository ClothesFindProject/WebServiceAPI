"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcaRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const MarcaController_1 = require("../controllers/MarcaController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestao de marcas
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
 *           description: URL da imagem da marca
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - Nome
 *             properties:
 *               Nome:
 *                 type: string
 *               Site:
 *                 type: string
 *                 nullable: true
 *               ImgMarca:
 *                 type: string
 *                 format: binary
 *                 nullable: true
 *               Ativo:
 *                 type: boolean
 *                 description: "Opcional. Default: true"
 *     responses:
 *       201:
 *         description: Marca criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaResponse'
 */
router.post('/', upload.single('ImgMarca'), MarcaController_1.MarcaController.create);
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
router.get('/', MarcaController_1.MarcaController.list);
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
 *         description: Marca nao encontrada
 */
router.get('/:id', MarcaController_1.MarcaController.findById);
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Nome:
 *                 type: string
 *               Site:
 *                 type: string
 *                 nullable: true
 *               ImgMarca:
 *                 type: string
 *                 format: binary
 *                 nullable: true
 *               Ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Marca atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaResponse'
 */
router.put('/:id', upload.single('ImgMarca'), MarcaController_1.MarcaController.update);
/**
 * @swagger
 * /api/marcas/{id}/status:
 *   patch:
 *     summary: Ativar ou inativar marca
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
 *             type: object
 *             required:
 *               - Ativo
 *             properties:
 *               Ativo:
 *                 type: boolean
 *                 description: true para ativar, false para inativar
 *     responses:
 *       200:
 *         description: Status atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaResponse'
 *       404:
 *         description: Marca nao encontrada
 */
router.patch('/:id/status', MarcaController_1.MarcaController.changeStatus);
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
 *       404:
 *         description: Marca nao encontrada
 */
router.delete('/:id', MarcaController_1.MarcaController.remove);
exports.marcaRoutes = router;
//# sourceMappingURL=marcaRoutes.js.map