import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface Imagem {
  Id: number;
  UrlImg: string;
  Descricao?: string | null;
  CriadoEm?: Date | null;
  IdProduto: number;
  created_at?: Date | null;
}

export type ImagemInsert = Omit<Imagem, 'Id'>;
export type ImagemUpdate = Partial<Omit<Imagem, 'Id'>>;

const parseDate = (value?: unknown): Date | null => {
  if (!value) return null;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
};

const rowToImagem = (row: RowDataPacket): Imagem => ({
  Id: row.Id,
  UrlImg: row.UrlImg,
  Descricao: row.Descricao,
  CriadoEm: parseDate(row.CriadoEm),
  IdProduto: row.IdProduto,
  created_at: parseDate(row.created_at),
});

const baseColumns = ['UrlImg', 'Descricao', 'CriadoEm', 'IdProduto', 'created_at'] as const;
const dateColumns = new Set(['CriadoEm', 'created_at']);

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const sanitizeValue = (column: string, value: unknown): unknown => {
  if (value === undefined) {
    return null;
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

const create = async (imagem: ImagemInsert): Promise<Imagem> => {
  const now = new Date();
  const payload: ImagemInsert = {
    ...imagem,
    CriadoEm: imagem.CriadoEm ?? now,
    created_at: imagem.created_at ?? now,
  };
  const placeholders = baseColumns.map(() => '?').join(', ');
  const query = `INSERT INTO Imagens (${baseColumns.join(', ')}) VALUES (${placeholders})`;
  const values = baseColumns.map((column) => sanitizeValue(column, (payload as Record<string, unknown>)[column]));
  const [result] = await pool.execute<ResultSetHeader>(query, values);
  return {
    ...payload,
    Id: result.insertId,
  };
};

const findAll = async (): Promise<Imagem[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Imagens ORDER BY CriadoEm DESC');
  return rows.map(rowToImagem);
};

const findById = async (id: number): Promise<Imagem | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Imagens WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToImagem(row);
};

const findByProdutoId = async (produtoId: number): Promise<Imagem[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Imagens WHERE IdProduto = ? ORDER BY CriadoEm DESC', [
    produtoId,
  ]);
  return rows.map(rowToImagem);
};

const update = async (id: number, data: ImagemUpdate): Promise<Imagem | null> => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return findById(id);
  }
  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([key, value]) => sanitizeValue(key, value));
  await pool.execute<ResultSetHeader>(`UPDATE Imagens SET ${setClause} WHERE Id = ?`, [...values, id]);
  return findById(id);
};

const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM Imagens WHERE Id = ?', [id]);
  return result.affectedRows > 0;
};

export const ImagemModel = {
  create,
  findAll,
  findById,
  findByProdutoId,
  update,
  remove,
};
