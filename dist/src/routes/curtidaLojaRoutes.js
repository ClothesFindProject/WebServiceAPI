"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curtidaLojaRoutes = void 0;
const express_1 = require("express");
const CurtidaLojaController_1 = require("../controllers/CurtidaLojaController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: CurtidasLojas
 *   description: Controle de curtidas nas empresas
 *
 * components:
 *   schemas:
 *     CurtidaLoja:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         IdUsuario:
 *           type: integer
 *         IdEmpresa:
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
 *     CurtidaLojaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/CurtidaLoja'
 *     CurtidaLojaListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CurtidaLoja'
 *     CurtidaLojaValidation:
 *       type: object
 *       properties:
 *         existe:
 *           type: boolean
 *         ativo:
 *           type: boolean
 *     CurtidaLojaValidationResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/CurtidaLojaValidation'
 *     CurtidaLojaEmpresasResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Empresa'
 */
/**
 * @swagger
 * /api/curtidas:
 *   get:
 *     summary: Listar curtidas
 *     tags: [CurtidasLojas]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         description: Filtra curtidas por usuário
 *       - in: query
 *         name: empresaId
 *         schema:
 *           type: integer
 *         description: Filtra curtidas por empresa
 *     responses:
 *       200:
 *         description: Lista de curtidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaLojaListResponse'
 */
router.get('/', CurtidaLojaController_1.CurtidaLojaController.list);
/**
 * @swagger
 * /api/curtidas/{id}:
 *   get:
 *     summary: Buscar curtida por ID
 *     tags: [CurtidasLojas]
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
 *               $ref: '#/components/schemas/CurtidaLojaResponse'
 *       404:
 *         description: Curtida não encontrada
 */
router.get('/:id', CurtidaLojaController_1.CurtidaLojaController.findById);
/**
 * @swagger
 * /api/curtidas/{id}:
 *   put:
 *     summary: Atualizar curtida
 *     tags: [CurtidasLojas]
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
 *             $ref: '#/components/schemas/CurtidaLoja'
 *     responses:
 *       200:
 *         description: Curtida atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaLojaResponse'
 */
router.put('/:id', CurtidaLojaController_1.CurtidaLojaController.update);
/**
 * @swagger
 * /api/curtidas/validarcurtida/{idUsuario}/{idEmpresa}:
 *   get:
 *     summary: Validar se um usuário curtiu uma empresa
 *     tags: [CurtidasLojas]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado da validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaLojaValidationResponse'
 */
router.get('/validarcurtida/:idUsuario/:idEmpresa', CurtidaLojaController_1.CurtidaLojaController.validate);
/**
 * @swagger
 * /api/curtidas/usuario/{idUsuario}:
 *   get:
 *     summary: Listar empresas curtidas por um usuário
 *     tags: [CurtidasLojas]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresas curtidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaLojaEmpresasResponse'
 */
router.get('/usuario/:idUsuario', CurtidaLojaController_1.CurtidaLojaController.listEmpresasCurtidas);
/**
 * @swagger
 * /api/curtidas:
 *   post:
 *     summary: Registrar curtida em uma empresa
 *     tags: [CurtidasLojas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CurtidaLoja'
 *     responses:
 *       201:
 *         description: Curtida registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaLojaResponse'
 */
router.post('/', CurtidaLojaController_1.CurtidaLojaController.create);
/**
 * @swagger
 * /api/curtidas/{id}:
 *   delete:
 *     summary: Remover curtida
 *     tags: [CurtidasLojas]
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
router.delete('/:id', CurtidaLojaController_1.CurtidaLojaController.remove);
/**
 * @swagger
 * /api/curtidas/desativar/{idUsuario}/{idEmpresa}:
 *   patch:
 *     summary: Desativar curtida por usuário e empresa
 *     tags: [CurtidasLojas]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curtida desativada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurtidaLojaResponse'
 *       404:
 *         description: Curtida não encontrada
 */
router.patch('/desativar/:idUsuario/:idEmpresa', CurtidaLojaController_1.CurtidaLojaController.deactivate);
exports.curtidaLojaRoutes = router;
//# sourceMappingURL=curtidaLojaRoutes.js.map