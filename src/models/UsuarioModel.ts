import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface Usuario {
  Id: number;
  Nome: string;
  SobreNome: string;
  CpfCnpj: string;
  Telefone?: string | null;
  Telefone2?: string | null;
  Pais?: string | null;
  UF?: string | null;
  Cidade?: string | null;
  Bairro?: string | null;
  Rua?: string | null;
  Empresa?: string | null;
  Ativo: boolean;
  ProximaExpiracao?: Date | null;
  DataCriacao?: Date;
  DataInativacao?: Date | null;
  IdMenu?: number | null;
  EmpresaId?: number | null;
  created_at?: Date;
  Senha?: string;
}

export type UsuarioInsert = Omit<Usuario, 'Id' | 'DataCriacao' | 'DataInativacao' | 'created_at'> & {
  DataCriacao?: Date;
  DataInativacao?: Date | null;
  created_at?: Date;
  Senha: string;
};

export type UsuarioUpdate = Partial<Omit<Usuario, 'Id'>>;

const rowToUsuario = (row: RowDataPacket): Usuario => {
  const usuario: Usuario = {
    Id: row.Id,
    Nome: row.Nome,
    SobreNome: row.SobreNome,
    CpfCnpj: row.CpfCnpj,
    Telefone: row.Telefone,
    Telefone2: row.Telefone2,
    Pais: row.Pais,
    UF: row.UF,
    Cidade: row.Cidade,
    Bairro: row.Bairro,
    Rua: row.Rua,
    Empresa: row.Empresa,
    Ativo: Boolean(row.Ativo),
    ProximaExpiracao: row.ProximaExpiracao ? new Date(row.ProximaExpiracao) : null,
    DataInativacao: row.DataInativacao ? new Date(row.DataInativacao) : null,
    IdMenu: row.IdMenu,
    EmpresaId: row.EmpresaId,
    Senha: row.Senha,
  };

  if (row.DataCriacao) {
    usuario.DataCriacao = new Date(row.DataCriacao);
  }

  if (row.created_at) {
    usuario.created_at = new Date(row.created_at);
  }

  return usuario;
};

const baseColumns = [
  'Nome',
  'Senha',
  'SobreNome',
  'CpfCnpj',
  'Telefone',
  'Telefone2',
  'Pais',
  'UF',
  'Cidade',
  'Bairro',
  'Rua',
  'Empresa',
  'Ativo',
  'ProximaExpiracao',
  'DataCriacao',
  'DataInativacao',
  'IdMenu',
  'EmpresaId',
  'created_at',
] as const;

const columnsIgnoreNull = new Set<(typeof baseColumns)[number]>(['ProximaExpiracao', 'DataInativacao', 'EmpresaId']);

const sanitizeValue = (value: unknown): unknown => {
  if (value === undefined) {
    return null;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  return value;
};

const create = async (usuario: UsuarioInsert): Promise<Usuario> => {
  const now = new Date();
  const payload = {
    ...usuario,
    DataCriacao: usuario.DataCriacao ?? now,
    created_at: usuario.created_at ?? now,
  };
  const columns = baseColumns.filter((column) => {
    if (!columnsIgnoreNull.has(column)) {
      return true;
    }
    const value = (payload as Record<string, unknown>)[column];
    return value !== null && value !== undefined;
  });
  const placeholders = columns.map(() => '?').join(', ');
  const query = `INSERT INTO Usuarios (${columns.join(', ')}) VALUES (${placeholders})`;
  const values = columns.map((column) => sanitizeValue((payload as Record<string, unknown>)[column]));
  const [result] = await pool.execute<ResultSetHeader>(query, values);
  return {
    ...payload,
    Id: result.insertId,
  };
};

const findByCpfCnpj = async (cpfCnpj: string): Promise<Usuario | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Usuarios WHERE CpfCnpj = ? LIMIT 1', [cpfCnpj]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToUsuario(row);
};

const findById = async (id: number): Promise<Usuario | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Usuarios WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToUsuario(row);
};

const findAll = async (): Promise<Usuario[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Usuarios ORDER BY DataCriacao DESC');
  return rows.map(rowToUsuario);
};

const update = async (id: number, data: UsuarioUpdate): Promise<Usuario | null> => {
  const entries = Object.entries(data).filter(([key, value]) => {
    if (value === undefined) {
      return false;
    }
    if (value === null && columnsIgnoreNull.has(key as (typeof baseColumns)[number])) {
      return false;
    }
    return true;
  });
  if (entries.length === 0) {
    return findById(id);
  }

  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([, value]) => sanitizeValue(value));
  await pool.execute<ResultSetHeader>(`UPDATE Usuarios SET ${setClause} WHERE Id = ?`, [...values, id]);
  return findById(id);
};

const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM Usuarios WHERE Id = ?', [id]);
  return result.affectedRows > 0;
};

export const UsuarioModel = {
  create,
  findByCpfCnpj,
  findById,
  findAll,
  update,
  remove,
};
