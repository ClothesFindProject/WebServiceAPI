"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagemModel = void 0;
const database_1 = require("../config/database");
const parseDate = (value) => {
    if (!value)
        return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};
const rowToImagem = (row) => ({
    Id: row.Id,
    UrlImg: row.UrlImg,
    Descricao: row.Descricao,
    CriadoEm: parseDate(row.CriadoEm),
    IdProduto: row.IdProduto,
    created_at: parseDate(row.created_at),
});
const baseColumns = ['UrlImg', 'Descricao', 'CriadoEm', 'IdProduto', 'created_at'];
const dateColumns = new Set(['CriadoEm', 'created_at']);
const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const sanitizeValue = (column, value) => {
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
const create = async (imagem) => {
    const now = new Date();
    const payload = {
        ...imagem,
        CriadoEm: imagem.CriadoEm ?? now,
        created_at: imagem.created_at ?? now,
    };
    const placeholders = baseColumns.map(() => '?').join(', ');
    const query = `INSERT INTO Imagens (${baseColumns.join(', ')}) VALUES (${placeholders})`;
    const values = baseColumns.map((column) => sanitizeValue(column, payload[column]));
    const [result] = await database_1.pool.execute(query, values);
    return {
        ...payload,
        Id: result.insertId,
    };
};
const findAll = async () => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Imagens ORDER BY CriadoEm DESC');
    return rows.map(rowToImagem);
};
const findById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Imagens WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToImagem(row);
};
const findByProdutoId = async (produtoId) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Imagens WHERE IdProduto = ? ORDER BY CriadoEm DESC', [
        produtoId,
    ]);
    return rows.map(rowToImagem);
};
const update = async (id, data) => {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
        return findById(id);
    }
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([key, value]) => sanitizeValue(key, value));
    await database_1.pool.execute(`UPDATE Imagens SET ${setClause} WHERE Id = ?`, [...values, id]);
    return findById(id);
};
const remove = async (id) => {
    const [result] = await database_1.pool.execute('DELETE FROM Imagens WHERE Id = ?', [id]);
    return result.affectedRows > 0;
};
exports.ImagemModel = {
    create,
    findAll,
    findById,
    findByProdutoId,
    update,
    remove,
};
//# sourceMappingURL=ImagemModel.js.map