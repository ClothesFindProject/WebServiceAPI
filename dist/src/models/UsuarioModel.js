"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const database_1 = require("../config/database");
const rowToUsuario = (row) => {
    const usuario = {
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
];
const sanitizeValue = (value) => {
    if (value === undefined) {
        return null;
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    return value;
};
const create = async (usuario) => {
    const now = new Date();
    const payload = {
        ...usuario,
        DataCriacao: usuario.DataCriacao ?? now,
        created_at: usuario.created_at ?? now,
    };
    const placeholders = baseColumns.map(() => '?').join(', ');
    const query = `INSERT INTO Usuarios (${baseColumns.join(', ')}) VALUES (${placeholders})`;
    const values = baseColumns.map((column) => sanitizeValue(payload[column]));
    const [result] = await database_1.pool.execute(query, values);
    return {
        ...payload,
        Id: result.insertId,
    };
};
const findByCpfCnpj = async (cpfCnpj) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Usuarios WHERE CpfCnpj = ? LIMIT 1', [cpfCnpj]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToUsuario(row);
};
const findById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Usuarios WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToUsuario(row);
};
const findAll = async () => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Usuarios ORDER BY DataCriacao DESC');
    return rows.map(rowToUsuario);
};
const update = async (id, data) => {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
        return findById(id);
    }
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => sanitizeValue(value));
    await database_1.pool.execute(`UPDATE Usuarios SET ${setClause} WHERE Id = ?`, [...values, id]);
    return findById(id);
};
const remove = async (id) => {
    const [result] = await database_1.pool.execute('DELETE FROM Usuarios WHERE Id = ?', [id]);
    return result.affectedRows > 0;
};
exports.UsuarioModel = {
    create,
    findByCpfCnpj,
    findById,
    findAll,
    update,
    remove,
};
//# sourceMappingURL=UsuarioModel.js.map