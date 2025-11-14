"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurtidaLojaModel = void 0;
const database_1 = require("../config/database");
const parseDate = (value) => {
    if (!value)
        return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};
const rowToCurtida = (row) => ({
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
const baseColumns = ['IdUsuario', 'IdEmpresa', 'DataCriacao', 'Origem', 'IP', 'UserAgent', 'Ativo', 'created_at'];
const dateColumns = new Set(['DataCriacao', 'created_at']);
const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const sanitizeValue = (column, value) => {
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
const create = async (data) => {
    const now = new Date();
    const payload = {
        ...data,
        DataCriacao: data.DataCriacao ?? now,
        Ativo: data.Ativo ?? true,
        created_at: data.created_at ?? now,
    };
    const placeholders = baseColumns.map(() => '?').join(', ');
    const query = `INSERT INTO CurtidasLojas (${baseColumns.join(', ')}) VALUES (${placeholders})`;
    const values = baseColumns.map((column) => sanitizeValue(column, payload[column]));
    const [result] = await database_1.pool.execute(query, values);
    return {
        ...payload,
        Id: result.insertId,
    };
};
const findAll = async () => {
    const [rows] = await database_1.pool.execute('SELECT * FROM CurtidasLojas ORDER BY DataCriacao DESC');
    return rows.map(rowToCurtida);
};
const findById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM CurtidasLojas WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToCurtida(row);
};
const findByUsuario = async (usuarioId) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM CurtidasLojas WHERE IdUsuario = ? ORDER BY DataCriacao DESC', [
        usuarioId,
    ]);
    return rows.map(rowToCurtida);
};
const findByEmpresa = async (empresaId) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM CurtidasLojas WHERE IdEmpresa = ? ORDER BY DataCriacao DESC', [
        empresaId,
    ]);
    return rows.map(rowToCurtida);
};
const findByUsuarioEmpresa = async (usuarioId, empresaId) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM CurtidasLojas WHERE IdUsuario = ? AND IdEmpresa = ? ORDER BY DataCriacao DESC LIMIT 1', [usuarioId, empresaId]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToCurtida(row);
};
const update = async (id, data) => {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
        return findById(id);
    }
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([key, value]) => sanitizeValue(key, value));
    await database_1.pool.execute(`UPDATE CurtidasLojas SET ${setClause} WHERE Id = ?`, [...values, id]);
    return findById(id);
};
const setAtivoByUsuarioEmpresa = async (usuarioId, empresaId, ativo) => {
    const [result] = await database_1.pool.execute('UPDATE CurtidasLojas SET Ativo = ? WHERE IdUsuario = ? AND IdEmpresa = ?', [
        ativo ? 1 : 0,
        usuarioId,
        empresaId,
    ]);
    return result.affectedRows > 0;
};
const remove = async (id) => {
    const [result] = await database_1.pool.execute('DELETE FROM CurtidasLojas WHERE Id = ?', [id]);
    return result.affectedRows > 0;
};
exports.CurtidaLojaModel = {
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
//# sourceMappingURL=CurtidaLojaModel.js.map