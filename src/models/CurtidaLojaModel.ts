import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface CurtidaLoja {
  Id: number;
  IdUsuario: number;
  IdEmpresa: number;
  DataCriacao?: Date | null;
  Origem?: string | null;
  IP?: string | null;
  UserAgent?: string | null;
  Ativo: boolean;
  created_at?: Date | null;
}

export type CurtidaLojaInsert = Omit<CurtidaLoja, 'Id'>;
export type CurtidaLojaUpdate = Partial<Omit<CurtidaLoja, 'Id'>>;

const parseDate = (value?: unknown): Date | null => {
  if (!value) return null;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
};

const rowToCurtida = (row: RowDataPacket): CurtidaLoja => ({
  Id: row.Id,
  IdUsuario: row.IdUsuario,
  IdEmpresa: row.IdEmpresa,
  DataCriacao: parseDate(row.DataCriacao),
  Origem: row.Origem,
  IP: row.IP,
  UserAgent: row.UserAgent,
  Ativo: Boolean(row.Ativo),
  created_at: parseDate(row.created_at),
});

const baseColumns = ['IdUsuario', 'IdEmpresa', 'DataCriacao', 'Origem', 'IP', 'UserAgent', 'Ativo', 'created_at'] as const;
const dateColumns = new Set(['DataCriacao', 'created_at']);

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const sanitizeValue = (column: string, value: unknown): unknown => {
  if (value === undefined) {
    return null;
  }
  if (column === 'Ativo' && typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (dateColumns.has(column)) {
    const dateValue = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(dateValue.getTime())) {
      return null;
    }
    return formatDateTime(dateValue);
  }
  return value;
};

const create = async (data: CurtidaLojaInsert): Promise<CurtidaLoja> => {
  const now = new Date();
  const payload: CurtidaLojaInsert = {
    ...data,
    DataCriacao: data.DataCriacao ?? now,
    Ativo: data.Ativo ?? true,
    created_at: data.created_at ?? now,
  };
  const placeholders = baseColumns.map(() => '?').join(', ');
  const query = `INSERT INTO CurtidasLojas (${baseColumns.join(', ')}) VALUES (${placeholders})`;
  const values = baseColumns.map((column) => sanitizeValue(column, (payload as Record<string, unknown>)[column]));
  const [result] = await pool.execute<ResultSetHeader>(query, values);
  return {
    ...payload,
    Id: result.insertId,
  };
};

const findAll = async (): Promise<CurtidaLoja[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasLojas ORDER BY DataCriacao DESC');
  return rows.map(rowToCurtida);
};

const findById = async (id: number): Promise<CurtidaLoja | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasLojas WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToCurtida(row);
};

const findByUsuario = async (usuarioId: number): Promise<CurtidaLoja[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasLojas WHERE IdUsuario = ? ORDER BY DataCriacao DESC', [
    usuarioId,
  ]);
  return rows.map(rowToCurtida);
};

const findByEmpresa = async (empresaId: number): Promise<CurtidaLoja[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasLojas WHERE IdEmpresa = ? ORDER BY DataCriacao DESC', [
    empresaId,
  ]);
  return rows.map(rowToCurtida);
};

const findByUsuarioEmpresa = async (usuarioId: number, empresaId: number): Promise<CurtidaLoja | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM CurtidasLojas WHERE IdUsuario = ? AND IdEmpresa = ? ORDER BY DataCriacao DESC LIMIT 1',
    [usuarioId, empresaId],
  );
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToCurtida(row);
};

const update = async (id: number, data: CurtidaLojaUpdate): Promise<CurtidaLoja | null> => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return findById(id);
  }
  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([key, value]) => sanitizeValue(key, value));
  await pool.execute<ResultSetHeader>(`UPDATE CurtidasLojas SET ${setClause} WHERE Id = ?`, [...values, id]);
  return findById(id);
};

const setAtivoByUsuarioEmpresa = async (usuarioId: number, empresaId: number, ativo: boolean): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('UPDATE CurtidasLojas SET Ativo = ? WHERE IdUsuario = ? AND IdEmpresa = ?', [
    ativo ? 1 : 0,
    usuarioId,
    empresaId,
  ]);
  return result.affectedRows > 0;
};

const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM CurtidasLojas WHERE Id = ?', [id]);
  return result.affectedRows > 0;
};

export const CurtidaLojaModel = {
  create,
  findAll,
  findById,
  findByUsuario,
  findByEmpresa,
  findByUsuarioEmpresa,
  update,
  setAtivoByUsuarioEmpresa,
  remove,
};
