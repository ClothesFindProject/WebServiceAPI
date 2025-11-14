"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoModel = void 0;
const database_1 = require("../config/database");
const parseDate = (value) => {
    if (!value)
        return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};
const parseTags = (value) => {
    if (!value)
        return [];
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.map((tag) => String(tag));
        }
    }
    catch (error) {
        // ignore parse errors
    }
    return [];
};
const rowToProduto = (row) => ({
    Id: row.Id,
    CodigoInterno: row.CodigoInterno,
    NomeProduto: row.NomeProduto,
    Descricao: row.Descricao,
    Genero: row.Genero,
    Estilo: row.Estilo,
    Modelo: row.Modelo,
    Composicao: row.Composicao,
    Peso: row.Peso,
    Altura: row.Altura,
    Largura: row.Largura,
    Tags: parseTags(row.Tags),
    Ativo: Boolean(row.Ativo),
    DataCriacao: parseDate(row.DataCriacao),
    DataAtualizacao: parseDate(row.DataAtualizacao),
    CurtidasTotal: row.CurtidasTotal,
    UltimaCurtidaEm: parseDate(row.UltimaCurtidaEm),
    IdEmpresa: row.IdEmpresa,
    IdMarca: row.IdMarca,
    created_at: parseDate(row.created_at),
});
const baseColumns = [
    'CodigoInterno',
    'NomeProduto',
    'Descricao',
    'Genero',
    'Estilo',
    'Modelo',
    'Composicao',
    'Peso',
    'Altura',
    'Largura',
    'Tags',
    'Ativo',
    'DataCriacao',
    'DataAtualizacao',
    'CurtidasTotal',
    'UltimaCurtidaEm',
    'IdEmpresa',
    'IdMarca',
    'created_at',
];
const dateColumns = new Set(['DataCriacao', 'DataAtualizacao', 'UltimaCurtidaEm', 'created_at']);
const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const sanitizeValue = (column, value) => {
    if (value === undefined) {
        return null;
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    if (column === 'Tags') {
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        if (typeof value === 'string') {
            return value;
        }
        return JSON.stringify([]);
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
const create = async (produto) => {
    const now = new Date();
    const payload = {
        ...produto,
        Tags: produto.Tags ?? [],
        Ativo: produto.Ativo ?? true,
        DataCriacao: produto.DataCriacao ?? now,
        DataAtualizacao: produto.DataAtualizacao ?? now,
        created_at: produto.created_at ?? now,
    };
    const placeholders = baseColumns.map(() => '?').join(', ');
    const query = `INSERT INTO Produtos (${baseColumns.join(', ')}) VALUES (${placeholders})`;
    const values = baseColumns.map((column) => sanitizeValue(column, payload[column]));
    const [result] = await database_1.pool.execute(query, values);
    return {
        ...payload,
        Id: result.insertId,
    };
};
const findAll = async () => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Produtos ORDER BY DataCriacao DESC');
    return rows.map(rowToProduto);
};
const findById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Produtos WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToProduto(row);
};
const update = async (id, data) => {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    if (entries.length === 0)
        return findById(id);
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([key, value]) => sanitizeValue(key, value));
    await database_1.pool.execute(`UPDATE Produtos SET ${setClause} WHERE Id = ?`, [...values, id]);
    return findById(id);
};
const remove = async (id) => {
    const [result] = await database_1.pool.execute('DELETE FROM Produtos WHERE Id = ?', [id]);
    return result.affectedRows > 0;
};
exports.ProdutoModel = {
    create,
    findAll,
    findById,
    findByEmpresaId: async (empresaId) => {
        const [rows] = await database_1.pool.execute('SELECT * FROM Produtos WHERE IdEmpresa = ? ORDER BY DataCriacao DESC', [
            empresaId,
        ]);
        return rows.map(rowToProduto);
    },
    update,
    remove,
};
//# sourceMappingURL=ProdutoModel.js.map