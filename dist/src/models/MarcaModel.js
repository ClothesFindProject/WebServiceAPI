"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaModel = void 0;
const database_1 = require("../config/database");
const rowToMarca = (row) => {
    const marca = {
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
const baseColumns = ['Nome', 'Site', 'Ativo', 'ImgMarca', 'created_at'];
const sanitizeValue = (column, value) => {
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
        const pad = (n) => n.toString().padStart(2, '0');
        return `${dateValue.getFullYear()}-${pad(dateValue.getMonth() + 1)}-${pad(dateValue.getDate())} ${pad(dateValue.getHours())}:${pad(dateValue.getMinutes())}:${pad(dateValue.getSeconds())}`;
    }
    return value;
};
const create = async (data) => {
    const payload = {
        ...data,
        Ativo: data.Ativo ?? true,
        created_at: data.created_at ?? new Date(),
    };
    const placeholders = baseColumns.map(() => '?').join(', ');
    const query = `INSERT INTO Marcas (${baseColumns.join(', ')}) VALUES (${placeholders})`;
    const values = baseColumns.map((column) => sanitizeValue(column, payload[column]));
    const [result] = await database_1.pool.execute(query, values);
    return {
        ...payload,
        Id: result.insertId,
    };
};
const findAll = async () => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Marcas ORDER BY Nome ASC');
    return rows.map(rowToMarca);
};
const findById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Marcas WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToMarca(row);
};
const update = async (id, data) => {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    if (entries.length === 0)
        return findById(id);
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([key, value]) => sanitizeValue(key, value));
    await database_1.pool.execute(`UPDATE Marcas SET ${setClause} WHERE Id = ?`, [...values, id]);
    return findById(id);
};
const remove = async (id) => {
    const [result] = await database_1.pool.execute('DELETE FROM Marcas WHERE Id = ?', [id]);
    return result.affectedRows > 0;
};
exports.MarcaModel = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=MarcaModel.js.map