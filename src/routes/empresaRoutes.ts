import { Router } from 'express';
import { EmpresaController } from '../controllers/EmpresaController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gestao de empresas
 *
 * components:
 *   schemas:
 *     Empresa:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         RazaoSocial:
 *           type: string
 *         NomeFantasia:
 *           type: string
 *           nullable: true
 *         InscricaoEstadual:
 *           type: string
 *           nullable: true
 *         InscricaoMunicipal:
 *           type: string
 *           nullable: true
 *         TipoEmpresa:
 *           type: string
 *           nullable: true
 *         DataFundacao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         CEP:
 *           type: string
 *           nullable: true
 *         Logradouro:
 *           type: string
 *           nullable: true
 *         Numero:
 *           type: string
 *           nullable: true
 *         Complemento:
 *           type: string
 *           nullable: true
 *         Bairro:
 *           type: string
 *           nullable: true
 *         Cidade:
 *           type: string
 *           nullable: true
 *         UF:
 *           type: string
 *           nullable: true
 *         Pais:
 *           type: string
 *           nullable: true
 *         TelefonePrincipal:
 *           type: string
 *           nullable: true
 *         TelefoneSecundario:
 *           type: string
 *           nullable: true
 *         Email:
 *           type: string
 *           nullable: true
 *         Site:
 *           type: string
 *           nullable: true
 *         ResponsavelContato:
 *           type: string
 *           nullable: true
 *         InscricaoSuframa:
 *           type: string
 *           nullable: true
 *         RegimeTributario:
 *           type: string
 *           nullable: true
 *         CodigoCNAE:
 *           type: string
 *           nullable: true
 *         BancoPrincipal:
 *           type: string
 *           nullable: true
 *         Agencia:
 *           type: string
 *           nullable: true
 *         ContaBancaria:
 *           type: string
 *           nullable: true
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
 *         CriadoPor:
 *           type: string
 *           nullable: true
 *         AtualizadoPor:
 *           type: string
 *           nullable: true
 *         GeoX:
 *           type: string
 *           nullable: true
 *         GeoY:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *     AssociateUsuarioPayload:
 *       type: object
 *       required:
 *         - usuarioId
 *       properties:
 *         usuarioId:
 *           type: integer
 *     EmpresaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Empresa'
 *     EmpresaListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Empresa'
 *     EmpresaAssociationResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             empresa:
 *               $ref: '#/components/schemas/Empresa'
 *             usuario:
 *               $ref: '#/components/schemas/Usuario'
 *     EmpresaDetalhada:
 *       allOf:
 *         - $ref: '#/components/schemas/Empresa'
 *       properties:
 *         Produtos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProdutoDetalhado'
 *     EmpresaDetalhadaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/EmpresaDetalhada'
 *     EmpresaDetalhadaListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmpresaDetalhada'
 */

/**
 * @swagger
 * /api/empresas:
 *   post:
 *     summary: Criar uma nova empresa
 *     tags: [Empresas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       201:
 *         description: Empresa criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaResponse'
 */
router.post('/', EmpresaController.create);

/**
 * @swagger
 * /api/empresas:
 *   get:
 *     summary: Listar empresas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaDetalhadaListResponse'
 */
router.get('/', EmpresaController.list);

/**
 * @swagger
 * /api/empresas/{id}:
 *   get:
 *     summary: Buscar empresa por ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaDetalhadaResponse'
 *       404:
 *         description: Empresa nao encontrada
 */
router.get('/:id', EmpresaController.findById);

/**
 * @swagger
 * /api/empresas/{id}:
 *   put:
 *     summary: Atualizar empresa
 *     tags: [Empresas]
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
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaResponse'
 */
router.put('/:id', EmpresaController.update);

/**
 * @swagger
 * /api/empresas/{id}:
 *   delete:
 *     summary: Remover empresa
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa removida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.delete('/:id', EmpresaController.remove);

/**
 * @swagger
 * /api/empresas/{id}/associar-usuario:
 *   post:
 *     summary: Associar um usuario a uma empresa
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssociateUsuarioPayload'
 *     responses:
 *       200:
 *         description: Associacao realizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaAssociationResponse'
 */
router.post('/:id/associar-usuario', EmpresaController.associateUsuario);

export const empresaRoutes = router;
