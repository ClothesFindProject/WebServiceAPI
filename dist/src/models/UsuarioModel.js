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
        UserImagem: row.UserImagem,
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
    'UserImagem',
    'Ativo',
    'ProximaExpiracao',
    'DataCriacao',
    'DataInativacao',
    'IdMenu',
    'EmpresaId',
    'created_at',
];
const columnsIgnoreNull = new Set(['ProximaExpiracao', 'DataInativacao', 'EmpresaId']);
const sanitizeValue = (value) => {
    if (value === undefined) {
        return null;
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    if (typeof value === 'string') {
        const lower = value.trim().toLowerCase();
        if (lower === 'true')
            return 1;
        if (lower === 'false')
            return 0;
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
    const columns = baseColumns.filter((column) => {
        if (!columnsIgnoreNull.has(column)) {
            return true;
        }
        const value = payload[column];
        return value !== null && value !== undefined;
    });
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO Usuarios (${columns.join(', ')}) VALUES (${placeholders})`;
    const values = columns.map((column) => sanitizeValue(payload[column]));
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
    const entries = Object.entries(data).filter(([key, value]) => {
        if (value === undefined) {
            return false;
        }
        if (value === null && columnsIgnoreNull.has(key)) {
            return false;
        }
        return true;
    });
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