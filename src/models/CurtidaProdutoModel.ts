import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface CurtidaProduto {
  Id: number;
  IdUsuario: number;
  IdProduto: number;
  DataCriacao?: Date | null;
  Origem?: string | null;
  IP?: string | null;
  UserAgent?: string | null;
  Ativo: boolean;
  created_at?: Date | null;
}

export type CurtidaProdutoInsert = Omit<CurtidaProduto, 'Id'>;
export type CurtidaProdutoUpdate = Partial<Omit<CurtidaProduto, 'Id'>>;

const parseDate = (value?: unknown): Date | null => {
  if (!value) return null;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
};

const rowToCurtida = (row: RowDataPacket): CurtidaProduto => ({
  Id: row.Id,
  IdUsuario: row.IdUsuario,
  IdProduto: row.IdProduto,
  DataCriacao: parseDate(row.DataCriacao),
  Origem: row.Origem,
  IP: row.IP,
  UserAgent: row.UserAgent,
  Ativo: Boolean(row.Ativo),
  created_at: parseDate(row.created_at),
});

const baseColumns = ['IdUsuario', 'IdProduto', 'DataCriacao', 'Origem', 'IP', 'UserAgent', 'Ativo', 'created_at'] as const;
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

const create = async (data: CurtidaProdutoInsert): Promise<CurtidaProduto> => {
  const now = new Date();
  const payload: CurtidaProdutoInsert = {
    ...data,
    DataCriacao: data.DataCriacao ?? now,
    Ativo: data.Ativo ?? true,
    created_at: data.created_at ?? now,
  };
  const placeholders = baseColumns.map(() => '?').join(', ');
  const query = `INSERT INTO CurtidasProdutos (${baseColumns.join(', ')}) VALUES (${placeholders})`;
  const values = baseColumns.map((column) => sanitizeValue(column, (payload as Record<string, unknown>)[column]));
  const [result] = await pool.execute<ResultSetHeader>(query, values);
  return {
    ...payload,
    Id: result.insertId,
  };
};

const findAll = async (): Promise<CurtidaProduto[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasProdutos ORDER BY DataCriacao DESC');
  return rows.map(rowToCurtida);
};

const findById = async (id: number): Promise<CurtidaProduto | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasProdutos WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) return null;
  const row = rows[0];
  if (!row) return null;
  return rowToCurtida(row);
};

const findByUsuario = async (usuarioId: number): Promise<CurtidaProduto[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasProdutos WHERE IdUsuario = ? ORDER BY DataCriacao DESC', [
    usuarioId,
  ]);
  return rows.map(rowToCurtida);
};

const findByProduto = async (produtoId: number): Promise<CurtidaProduto[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM CurtidasProdutos WHERE IdProduto = ? ORDER BY DataCriacao DESC', [
    produtoId,
  ]);
  return rows.map(rowToCurtida);
};

const findByUsuarioProduto = async (usuarioId: number, produtoId: number): Promise<CurtidaProduto | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM CurtidasProdutos WHERE IdUsuario = ? AND IdProduto = ? ORDER BY DataCriacao DESC LIMIT 1',
    [usuarioId, produtoId],
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  if (!row) return null;
  return rowToCurtida(row);
};

const update = async (id: number, data: CurtidaProdutoUpdate): Promise<CurtidaProduto | null> => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  if (entries.length === 0) return findById(id);
  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([key, value]) => sanitizeValue(key, value));
  await pool.execute<ResultSetHeader>(`UPDATE CurtidasProdutos SET ${setClause} WHERE Id = ?`, [...values, id]);
  return findById(id);
};

const setAtivoByUsuarioProduto = async (usuarioId: number, produtoId: number, ativo: boolean): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('UPDATE CurtidasProdutos SET Ativo = ? WHERE IdUsuario = ? AND IdProduto = ?', [
    ativo ? 1 : 0,
    usuarioId,
    produtoId,
  ]);
  return result.affectedRows > 0;
};

const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM CurtidasProdutos WHERE Id = ?', [id]);
  return result.affectedRows > 0;
};

export const CurtidaProdutoModel = {
  create,
  findAll,
  findById,
  findByUsuario,
  findByProduto,
  findByUsuarioProduto,
  update,
  setAtivoByUsuarioProduto,
  remove,
};
