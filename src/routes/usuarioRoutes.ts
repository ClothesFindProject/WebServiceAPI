import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const router = Router();

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
 *         Ativo:
 *           type: boolean
 *         ProximaExpiracao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Opcional no cadastro. Se enviado null será ignorado. Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         DataCriacao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Opcional no cadastro. Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         DataInativacao:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Opcional no cadastro. Se enviado null será ignorado. Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
 *         IdMenu:
 *           type: integer
 *           nullable: true
 *         EmpresaId:
 *           type: integer
 *           nullable: true
 *           description: "Opcional no cadastro. Se enviado null será ignorado"
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Formato esperado: 'YYYY-MM-DD HH:mm:ss'"
 *           example: '2025-11-14 13:15:48'
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
 *         application/json:
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
router.post('/register', UsuarioController.register);

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
router.post('/login', UsuarioController.login);

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
router.get('/', UsuarioController.list);

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
router.get('/:id', UsuarioController.findById);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualizar usuario
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
 *             $ref: '#/components/schemas/Usuario'
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
router.put('/:id', UsuarioController.update);

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
router.delete('/:id', UsuarioController.remove);

export const usuarioRoutes = router;
