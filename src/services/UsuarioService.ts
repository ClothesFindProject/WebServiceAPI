import jwt from 'jsonwebtoken';
import { UsuarioModel, UsuarioInsert, UsuarioUpdate, Usuario } from '../models/UsuarioModel';
import { MenuModel, MenuTree } from '../models/MenuModel';
import { hashPassword, comparePassword } from '../utils/password';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

type RegisterRequired = Pick<UsuarioInsert, 'Nome' | 'SobreNome' | 'CpfCnpj'>;

export type RegisterUsuarioDTO = RegisterRequired &
  Partial<Omit<UsuarioInsert, keyof RegisterRequired | 'Senha'>> & {
    Senha: string;
  };

export type LoginDTO = {
  CpfCnpj: string;
  Senha: string;
};

export type UsuarioWithMenu = {
  usuario: Omit<Usuario, 'Senha'>;
  menu: MenuTree | null;
};

const sanitizeUsuario = (usuario: Usuario): Omit<Usuario, 'Senha'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Senha, ...rest } = usuario;
  return rest;
};

const buildUsuarioWithMenu = async (usuario: Usuario): Promise<UsuarioWithMenu> => {
  const menu = usuario.IdMenu ? await MenuModel.findMenuTreeById(usuario.IdMenu) : null;
  return {
    usuario: sanitizeUsuario(usuario),
    menu,
  };
};

export const UsuarioService = {
  async register(data: RegisterUsuarioDTO) {
    const existing = await UsuarioModel.findByCpfCnpj(data.CpfCnpj);
    if (existing) {
      throw ApiError.badRequest('Usuário já existe para este CPF/CNPJ');
    }
    const senhaHash = await hashPassword(data.Senha);
    const usuarioCriado = await UsuarioModel.create({
      ...data,
      Senha: senhaHash,
      Ativo: data.Ativo ?? true,
    });
    return sanitizeUsuario(usuarioCriado);
  },

  async login({ CpfCnpj, Senha }: LoginDTO) {
    const usuario = await UsuarioModel.findByCpfCnpj(CpfCnpj);
    if (!usuario?.Senha) {
      throw ApiError.unauthorized('Credenciais inválidas');
    }

    const senhaValida = await comparePassword(Senha, usuario.Senha);
    if (!senhaValida) {
      throw ApiError.unauthorized('Credenciais inválidas');
    }

    const token = jwt.sign(
      {
        sub: usuario.Id,
        Nome: usuario.Nome,
        CpfCnpj: usuario.CpfCnpj,
      },
      env.jwtSecret,
      { expiresIn: '1h' },
    );

    const usuarioComMenu = await buildUsuarioWithMenu(usuario);

    return {
      token,
      ...usuarioComMenu,
    };
  },

  async findAll() {
    const usuarios = await UsuarioModel.findAll();
    return Promise.all(usuarios.map((usuario) => buildUsuarioWithMenu(usuario)));
  },

  async findById(id: number) {
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      throw ApiError.notFound('Usuário não encontrado');
    }
    return buildUsuarioWithMenu(usuario);
  },

  async update(id: number, data: UsuarioUpdate) {
    const payload = { ...data };
    if (data.Senha) {
      payload.Senha = await hashPassword(data.Senha);
    }
    const updated = await UsuarioModel.update(id, payload);
    if (!updated) {
      throw ApiError.notFound('Usuário não encontrado');
    }
    return sanitizeUsuario(updated);
  },

  async remove(id: number) {
    const deleted = await UsuarioModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Usuário não encontrado');
    }
  },
};
