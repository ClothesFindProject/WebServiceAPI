import jwt from 'jsonwebtoken';
import { UsuarioModel, UsuarioInsert, UsuarioUpdate, Usuario } from '../models/UsuarioModel';
import { MenuModel, MenuTree } from '../models/MenuModel';
import { hashPassword, comparePassword } from '../utils/password';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { uploadUsuarioImagem } from '../config/cloudflare';

const isValidCpfOrCnpj = (value: string): boolean => {
  const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cpfPattern.test(value) || cnpjPattern.test(value);
};

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
  UserImagem: string | null;
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
    UserImagem: usuario.UserImagem ?? null,
  };
};

export const UsuarioService = {
  async register(data: RegisterUsuarioDTO, file?: any) {
    if (!isValidCpfOrCnpj(data.CpfCnpj)) {
      throw ApiError.badRequest('CPF ou CNPJ no formato errado');
    }
    const existing = await UsuarioModel.findByCpfCnpj(data.CpfCnpj);
    if (existing) {
      throw ApiError.badRequest('Usuario ja existe para este CPF/CNPJ');
    }

    let userImagemUrl: string | undefined;
    if (file) {
      userImagemUrl = await uploadUsuarioImagem(file);
    }

    const senhaHash = await hashPassword(data.Senha);
    const usuarioCriado = await UsuarioModel.create({
      ...data,
      Senha: senhaHash,
      Ativo: data.Ativo ?? true,
      UserImagem: userImagemUrl ?? (data as any).UserImagem ?? null,
    });
    return sanitizeUsuario(usuarioCriado);
  },

  async login({ CpfCnpj, Senha }: LoginDTO) {
    const usuario = await UsuarioModel.findByCpfCnpj(CpfCnpj);
    if (!usuario?.Senha) {
      throw ApiError.unauthorized('Credenciais invalidas');
    }
    if (!usuario.Ativo) {
      throw ApiError.unauthorized('Usuario inativo, entre em contato com o administrador');
    }

    const senhaValida = await comparePassword(Senha, usuario.Senha);
    if (!senhaValida) {
      throw ApiError.unauthorized('Credenciais invalidas');
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
      throw ApiError.notFound('Usuario nao encontrado');
    }
    return buildUsuarioWithMenu(usuario);
  },

  async update(id: number, data: UsuarioUpdate, file?: any) {
    const payload = { ...data };
    if (file) {
      payload.UserImagem = await uploadUsuarioImagem(file);
    }
    if (data.Senha) {
      payload.Senha = await hashPassword(data.Senha);
    }
    const updated = await UsuarioModel.update(id, payload);
    if (!updated) {
      throw ApiError.notFound('Usuario nao encontrado');
    }
    return sanitizeUsuario(updated);
  },

  async remove(id: number) {
    const deleted = await UsuarioModel.remove(id);
    if (!deleted) {
      throw ApiError.notFound('Usuario nao encontrado');
    }
  },

  async changeStatus(id: number, ativo: unknown) {
    const parsedAtivo =
      typeof ativo === 'string' ? ['true', '1', 'yes', 'on'].includes(ativo.toLowerCase()) : Boolean(ativo);
    const updated = await UsuarioModel.update(id, { Ativo: parsedAtivo });
    if (!updated) {
      throw ApiError.notFound('Usuario nao encontrado');
    }
    return sanitizeUsuario(updated);
  },
};
