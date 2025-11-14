import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface Empresa {
  Id: number;
  RazaoSocial: string;
  NomeFantasia?: string | null;
  InscricaoEstadual?: string | null;
  InscricaoMunicipal?: string | null;
  TipoEmpresa?: string | null;
  DataFundacao?: Date | null;
  CEP?: string | null;
  Logradouro?: string | null;
  Numero?: string | null;
  Complemento?: string | null;
  Bairro?: string | null;
  Cidade?: string | null;
  UF?: string | null;
  Pais?: string | null;
  TelefonePrincipal?: string | null;
  TelefoneSecundario?: string | null;
  Email?: string | null;
  Site?: string | null;
  ResponsavelContato?: string | null;
  InscricaoSuframa?: string | null;
  RegimeTributario?: string | null;
  CodigoCNAE?: string | null;
  BancoPrincipal?: string | null;
  Agencia?: string | null;
  ContaBancaria?: string | null;
  Ativo: boolean;
  DataCriacao?: Date | null;
  DataAtualizacao?: Date | null;
  CriadoPor?: string | null;
  AtualizadoPor?: string | null;
  GeoX?: string | null;
  GeoY?: string | null;
  created_at?: Date | null;
}

export type EmpresaInsert = Omit<Empresa, 'Id'>;
export type EmpresaUpdate = Partial<Omit<Empresa, 'Id'>>;

const rowToEmpresa = (row: RowDataPacket): Empresa => {
  const empresa: Empresa = {
    Id: row.Id,
    RazaoSocial: row.RazaoSocial,
    NomeFantasia: row.NomeFantasia,
    InscricaoEstadual: row.InscricaoEstadual,
    InscricaoMunicipal: row.InscricaoMunicipal,
    TipoEmpresa: row.TipoEmpresa,
    DataFundacao: row.DataFundacao ? new Date(row.DataFundacao) : null,
    CEP: row.CEP,
    Logradouro: row.Logradouro,
    Numero: row.Numero,
    Complemento: row.Complemento,
    Bairro: row.Bairro,
    Cidade: row.Cidade,
    UF: row.UF,
    Pais: row.Pais,
    TelefonePrincipal: row.TelefonePrincipal,
    TelefoneSecundario: row.TelefoneSecundario,
    Email: row.Email,
    Site: row.Site,
    ResponsavelContato: row.ResponsavelContato,
    InscricaoSuframa: row.InscricaoSuframa,
    RegimeTributario: row.RegimeTributario,
    CodigoCNAE: row.CodigoCNAE,
    BancoPrincipal: row.BancoPrincipal,
    Agencia: row.Agencia,
    ContaBancaria: row.ContaBancaria,
    Ativo: Boolean(row.Ativo),
    DataCriacao: row.DataCriacao ? new Date(row.DataCriacao) : null,
    DataAtualizacao: row.DataAtualizacao ? new Date(row.DataAtualizacao) : null,
    CriadoPor: row.CriadoPor,
    AtualizadoPor: row.AtualizadoPor,
    GeoX: row.GeoX,
    GeoY: row.GeoY,
    created_at: row.created_at ? new Date(row.created_at) : null,
  };
  return empresa;
};

const baseColumns = [
  'RazaoSocial',
  'NomeFantasia',
  'InscricaoEstadual',
  'InscricaoMunicipal',
  'TipoEmpresa',
  'DataFundacao',
  'CEP',
  'Logradouro',
  'Numero',
  'Complemento',
  'Bairro',
  'Cidade',
  'UF',
  'Pais',
  'TelefonePrincipal',
  'TelefoneSecundario',
  'Email',
  'Site',
  'ResponsavelContato',
  'InscricaoSuframa',
  'RegimeTributario',
  'CodigoCNAE',
  'BancoPrincipal',
  'Agencia',
  'ContaBancaria',
  'Ativo',
  'DataCriacao',
  'DataAtualizacao',
  'CriadoPor',
  'AtualizadoPor',
  'GeoX',
  'GeoY',
  'created_at',
] as const;

const dateColumns = new Set(['DataFundacao', 'DataCriacao', 'DataAtualizacao', 'created_at']);

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const sanitizeValue = (column: string, value: unknown): unknown => {
  if (value === undefined) {
    return null;
  }
  if (typeof value === 'boolean') {
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

const create = async (empresa: EmpresaInsert): Promise<Empresa> => {
  const now = new Date();
  const payload: EmpresaInsert = {
    ...empresa,
    DataCriacao: empresa.DataCriacao ?? now,
    DataAtualizacao: empresa.DataAtualizacao ?? now,
    created_at: empresa.created_at ?? now,
    Ativo: empresa.Ativo ?? true,
  };

  const placeholders = baseColumns.map(() => '?').join(', ');
  const query = `INSERT INTO Empresas (${baseColumns.join(', ')}) VALUES (${placeholders})`;
  const values = baseColumns.map((column) => sanitizeValue(column, (payload as Record<string, unknown>)[column]));
  const [result] = await pool.execute<ResultSetHeader>(query, values);

  return {
    ...payload,
    Id: result.insertId,
  };
};

const findAll = async (): Promise<Empresa[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Empresas ORDER BY DataCriacao DESC');
  return rows.map(rowToEmpresa);
};

const findById = async (id: number): Promise<Empresa | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Empresas WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToEmpresa(row);
};

const update = async (id: number, data: EmpresaUpdate): Promise<Empresa | null> => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return findById(id);
  }

  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([key, value]) => sanitizeValue(key, value));
  await pool.execute<ResultSetHeader>(`UPDATE Empresas SET ${setClause} WHERE Id = ?`, [...values, id]);
  return findById(id);
};

const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM Empresas WHERE Id = ?', [id]);
  return result.affectedRows > 0;
};

export const EmpresaModel = {
  create,
  findAll,
  findById,
  update,
  remove,
};
