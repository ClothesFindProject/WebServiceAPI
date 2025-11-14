"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curtidaProdutoRoutes = void 0;
const express_1 = require("express");
const CurtidaProdutoController_1 = require("../controllers/CurtidaProdutoController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: CurtidasProdutos
 *   description: Controle de curtidas em produtos
 *
 * components:
 *   schemas:
 *     CurtidaProduto:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         IdUsuario:
 *           type: integer
 *         IdProduto:
 *           type: integer
 *         DataCriacao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *         Origem:
 *           type: string
 *           nullable: true
 *         IP:
 *           type: string
 *           nullable: true
 *         UserAgent:
 *           type: string
 *           nullable: true
 *         Ativo:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *     CurtidaProdutoResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/CurtidaProduto'
 *     CurtidaProdutoListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CurtidaProduto'
 *     CurtidaProdutoValidationResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/CurtidaLojaValidation'
 *     CurtidaProdutoProdutosResponse:
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
 * /api/curtidas-produtos:
 *   post:
 *     summary: Registrar curtida em um produto
 *     tags: [CurtidasProdutos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CurtidaProduto'
 *     responses:
 *       201:
 *         description: Curtida registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoResponse'
 */
router.post('/', CurtidaProdutoController_1.CurtidaProdutoController.create);
/**
 * @swagger
 * /api/curtidas-produtos:
 *   get:
 *     summary: Listar curtidas de produtos
 *     tags: [CurtidasProdutos]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         description: Filtra curtidas por usuário
 *       - in: query
 *         name: produtoId
 *         schema:
 *           type: integer
 *         description: Filtra curtidas por produto
 *     responses:
 *       200:
 *         description: Lista de curtidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoListResponse'
 */
router.get('/', CurtidaProdutoController_1.CurtidaProdutoController.list);
/**
 * @swagger
 * /api/curtidas-produtos/{id}:
 *   get:
 *     summary: Buscar curtida de produto por ID
 *     tags: [CurtidasProdutos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curtida encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoResponse'
 *       404:
 *         description: Curtida não encontrada
 */
router.get('/:id', CurtidaProdutoController_1.CurtidaProdutoController.findById);
/**
 * @swagger
 * /api/curtidas-produtos/{id}:
 *   put:
 *     summary: Atualizar curtida de produto
 *     tags: [CurtidasProdutos]
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
 *             $ref: '#/components/schemas/CurtidaProduto'
 *     responses:
 *       200:
 *         description: Curtida atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoResponse'
 */
router.put('/:id', CurtidaProdutoController_1.CurtidaProdutoController.update);
/**
 * @swagger
 * /api/curtidas-produtos/{id}:
 *   delete:
 *     summary: Remover curtida de produto
 *     tags: [CurtidasProdutos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curtida removida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.delete('/:id', CurtidaProdutoController_1.CurtidaProdutoController.remove);
/**
 * @swagger
 * /api/curtidas-produtos/validarcurtida/{idUsuario}/{idProduto}:
 *   get:
 *     summary: Validar curtida de produto
 *     tags: [CurtidasProdutos]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idProduto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado da validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoValidationResponse'
 */
router.get('/validarcurtida/:idUsuario/:idProduto', CurtidaProdutoController_1.CurtidaProdutoController.validate);
/**
 * @swagger
 * /api/curtidas-produtos/desativar/{idUsuario}/{idProduto}:
 *   patch:
 *     summary: Desativar curtida de produto
 *     tags: [CurtidasProdutos]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idProduto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curtida desativada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoResponse'
 *       404:
 *         description: Curtida não encontrada
 */
router.patch('/desativar/:idUsuario/:idProduto', CurtidaProdutoController_1.CurtidaProdutoController.deactivate);
/**
 * @swagger
 * /api/curtidas-produtos/usuario/{idUsuario}:
 *   get:
 *     summary: Listar produtos curtidos por um usuário
 *     tags: [CurtidasProdutos]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produtos curtidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaProdutoProdutosResponse'
 */
router.get('/usuario/:idUsuario', CurtidaProdutoController_1.CurtidaProdutoController.listProdutosCurtidos);
exports.curtidaProdutoRoutes = router;
//# sourceMappingURL=curtidaProdutoRoutes.js.map