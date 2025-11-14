import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface Marca {
  Id: number;
  Nome: string;
  Site?: string | null;
  Ativo: boolean;
  ImgMarca?: string | null;
  created_at?: Date | null;
}

export type MarcaInsert = Omit<Marca, 'Id'>;
export type MarcaUpdate = Partial<Omit<Marca, 'Id'>>;

const rowToMarca = (row: RowDataPacket): Marca => {
  const marca: Marca = {
    Id: row.Id,
    Nome: row.Nome,
    Site: row.Site,
    Ativo: Boolean(row.Ativo),
    ImgMarca: row.ImgMarca,
  };
  if (row.created_at) {
    marca.created_at = new Date(row.created_at);
  }
  return marca;
};

const baseColumns = ['Nome', 'Site', 'Ativo', 'ImgMarca', 'created_at'] as const;

const sanitizeValue = (column: string, value: unknown): unknown => {
  if (value === undefined) {
    return null;
  }
  if (column === 'Ativo' && typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (column === 'created_at') {
    const dateValue = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(dateValue.getTime())) {
      return null;
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${dateValue.getFullYear()}-${pad(dateValue.getMonth() + 1)}-${pad(dateValue.getDate())} ${pad(dateValue.getHours())}:${pad(dateValue.getMinutes())}:${pad(dateValue.getSeconds())}`;
  }
  return value;
};

const create = async (data: MarcaInsert): Promise<Marca> => {
  const payload: MarcaInsert = {
    ...data,
    Ativo: data.Ativo ?? true,
    created_at: data.created_at ?? new Date(),
  };
  const placeholders = baseColumns.map(() => '?').join(', ');
  const query = `INSERT INTO Marcas (${baseColumns.join(', ')}) VALUES (${placeholders})`;
  const values = baseColumns.map((column) => sanitizeValue(column, (payload as Record<string, unknown>)[column]));
  const [result] = await pool.execute<ResultSetHeader>(query, values);
  return {
    ...payload,
    Id: result.insertId,
  };
};

const findAll = async (): Promise<Marca[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Marcas ORDER BY Nome ASC');
  return rows.map(rowToMarca);
};

const findById = async (id: number): Promise<Marca | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Marcas WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToMarca(row);
};

const update = async (id: number, data: MarcaUpdate): Promise<Marca | null> => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  if (entries.length === 0) return findById(id);
  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([key, value]) => sanitizeValue(key, value));
  await pool.execute<ResultSetHeader>(`UPDATE Marcas SET ${setClause} WHERE Id = ?`, [...values, id]);
  return findById(id);
};

const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM Marcas WHERE Id = ?', [id]);
  return result.affectedRows > 0;
};

export const MarcaModel = {
  create,
  findAll,
  findById,
  update,
  remove,
};
