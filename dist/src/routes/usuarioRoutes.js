"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const UsuarioController_1 = require("../controllers/UsuarioController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Nome:
 *           type: string
 *         Senha:
 *           type: string
 *           format: password
 *           writeOnly: true
 *         SobreNome:
 *           type: string
 *         CpfCnpj:
 *           type: string
 *         Telefone:
 *           type: string
 *           nullable: true
 *         Telefone2:
 *           type: string
 *           nullable: true
 *         Pais:
 *           type: string
 *           nullable: true
 *         UF:
 *           type: string
 *           nullable: true
 *         Cidade:
 *           type: string
 *           nullable: true
 *         Bairro:
 *           type: string
 *           nullable: true
 *         Rua:
 *           type: string
 *           nullable: true
 *         Empresa:
 *           type: string
 *           nullable: true
 *         UserImagem:
 *           type: string
 *           nullable: true
 *           description: URL da imagem de perfil no R2
 *         Ativo:
 *           type: boolean
 *         IdMenu:
 *           type: integer
 *           nullable: true
 *         EmpresaId:
 *           type: integer
 *           nullable: true
 *           description: "Opcional no cadastro. Se enviado null será ignorado"
 *     UsuarioRegister:
 *       type: object
 *       required:
 *         - Nome
 *         - SobreNome
 *         - CpfCnpj
 *         - Senha
 *       properties:
 *         Nome:
 *           type: string
 *         SobreNome:
 *           type: string
 *         CpfCnpj:
 *           type: string
 *         Senha:
 *           type: string
 *           format: password
 *         Telefone:
 *           type: string
 *           nullable: true
 *         Telefone2:
 *           type: string
 *           nullable: true
 *         Pais:
 *           type: string
 *           nullable: true
 *         UF:
 *           type: string
 *           nullable: true
 *         Cidade:
 *           type: string
 *           nullable: true
 *         Bairro:
 *           type: string
 *           nullable: true
 *         Rua:
 *           type: string
 *           nullable: true
 *         Empresa:
 *           type: string
 *           nullable: true
 *         UserImagem:
 *           type: string
 *           format: binary
 *           nullable: true
 *           description: Upload da imagem de perfil no R2 (opcional no cadastro)
 *         Ativo:
 *           type: boolean
 *           description: "Opcional no cadastro. Default: true"
 *         IdMenu:
 *           type: integer
 *           nullable: true
 *         EmpresaId:
 *           type: integer
 *           nullable: true
 *           description: "Opcional no cadastro. Se enviado null será ignorado"
 *     UsuarioUpdatePayload:
 *       type: object
 *       properties:
 *         Nome:
 *           type: string
 *         SobreNome:
 *           type: string
 *         CpfCnpj:
 *           type: string
 *         Telefone:
 *           type: string
 *           nullable: true
 *         Telefone2:
 *           type: string
 *           nullable: true
 *         Pais:
 *           type: string
 *           nullable: true
 *         UF:
 *           type: string
 *           nullable: true
 *         Cidade:
 *           type: string
 *           nullable: true
 *         Bairro:
 *           type: string
 *           nullable: true
 *         Rua:
 *           type: string
 *           nullable: true
 *         Empresa:
 *           type: string
 *           nullable: true
 *         UserImagem:
 *           type: string
 *           format: binary
 *           nullable: true
 *         IdMenu:
 *           type: integer
 *           nullable: true
 *         EmpresaId:
 *           type: integer
 *           nullable: true
 *           description: "Opcional. Se enviado null será ignorado"
 *     UsuarioLogin:
 *       type: object
 *       required:
 *         - CpfCnpj
 *         - Senha
 *       properties:
 *         CpfCnpj:
 *           type: string
 *         Senha:
 *           type: string
 *           format: password
 *     Menu:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Nome:
 *           type: string
 *         Link:
 *           type: string
 *           nullable: true
 *         Icone:
 *           type: string
 *           nullable: true
 *         IdNivelUsuario:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *     Submenu:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Nome:
 *           type: string
 *         Link:
 *           type: string
 *           nullable: true
 *         Icone:
 *           type: string
 *           nullable: true
 *         MenuId:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *     NivelUsuario:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *         Nivel:
 *           type: string
 *         Descricao:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *     MenuTree:
 *       allOf:
 *         - $ref: '#/components/schemas/Menu'
 *       properties:
 *         submenus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Submenu'
 *         nivel:
 *           $ref: '#/components/schemas/NivelUsuario'
 *     UsuarioWithMenu:
 *       type: object
 *       properties:
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *         menu:
 *           $ref: '#/components/schemas/MenuTree'
 *           nullable: true
 *         UserImagem:
 *           type: string
 *           nullable: true
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     UsuarioResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Usuario'
 *     UsuarioWithMenuResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UsuarioWithMenu'
 *     UsuarioListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UsuarioWithMenu'
 *     UsuarioLoginResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageResponse'
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             usuario:
 *               $ref: '#/components/schemas/Usuario'
 *             menu:
 *               $ref: '#/components/schemas/MenuTree'
 *               nullable: true
 *             UserImagem:
 *               type: string
 *               nullable: true
 */
/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar um novo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegister'
 *     responses:
 *       201:
 *         description: Usuario criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Dados invalidos
 */
router.post('/register', upload.single('UserImagem'), UsuarioController_1.UsuarioController.register);
/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Realizar login
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioLoginResponse'
 *       401:
 *         description: Credenciais invalidas
 */
router.post('/login', UsuarioController_1.UsuarioController.login);
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioListResponse'
 */
router.get('/', UsuarioController_1.UsuarioController.list);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Buscar usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario localizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioWithMenuResponse'
 *       404:
 *         description: Usuario nao encontrado
 */
router.get('/:id', UsuarioController_1.UsuarioController.findById);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualizar usuario (inclui upload de imagem de perfil)
 *     tags: [Usuarios]
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
 *             $ref: '#/components/schemas/UsuarioUpdatePayload'
 *     responses:
 *       200:
 *         description: Usuario atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioWithMenuResponse'
 *       404:
 *         description: Usuario nao encontrado
 */
router.put('/:id', upload.single('UserImagem'), UsuarioController_1.UsuarioController.update);
/**
 * @swagger
 * /api/usuarios/{id}/status:
 *   patch:
 *     summary: Ativar ou inativar usuario
 *     tags: [Usuarios]
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
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       404:
 *         description: Usuario nao encontrado
 */
router.patch('/:id/status', UsuarioController_1.UsuarioController.changeStatus);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remover usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario removido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Usuario nao encontrado
 */
router.delete('/:id', UsuarioController_1.UsuarioController.remove);
exports.usuarioRoutes = router;
//# sourceMappingURL=usuarioRoutes.js.map