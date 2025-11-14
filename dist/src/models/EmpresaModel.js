"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaModel = void 0;
const database_1 = require("../config/database");
const rowToEmpresa = (row) => {
    const empresa = {
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
        LinkInstagram: row.LinkInstagram,
        LinkWhatsapp: row.LinkWhatsapp,
        LinkSite: row.LinkSite,
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
    'LinkInstagram',
    'LinkWhatsapp',
    'LinkSite',
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
];
const dateColumns = new Set(['DataFundacao', 'DataCriacao', 'DataAtualizacao', 'created_at']);
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
    if (dateColumns.has(column)) {
        const dateValue = value instanceof Date ? value : new Date(String(value));
        if (Number.isNaN(dateValue.getTime())) {
            return null;
        }
        return formatDateTime(dateValue);
    }
    return value;
};
const create = async (empresa) => {
    const now = new Date();
    const payload = {
        ...empresa,
        DataCriacao: empresa.DataCriacao ?? now,
        DataAtualizacao: empresa.DataAtualizacao ?? now,
        created_at: empresa.created_at ?? now,
        Ativo: empresa.Ativo ?? true,
    };
    const placeholders = baseColumns.map(() => '?').join(', ');
    const query = `INSERT INTO Empresas (${baseColumns.join(', ')}) VALUES (${placeholders})`;
    const values = baseColumns.map((column) => sanitizeValue(column, payload[column]));
    const [result] = await database_1.pool.execute(query, values);
    return {
        ...payload,
        Id: result.insertId,
    };
};
const findAll = async () => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Empresas ORDER BY DataCriacao DESC');
    return rows.map(rowToEmpresa);
};
const findById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Empresas WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToEmpresa(row);
};
const update = async (id, data) => {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
        return findById(id);
    }
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([key, value]) => sanitizeValue(key, value));
    await database_1.pool.execute(`UPDATE Empresas SET ${setClause} WHERE Id = ?`, [...values, id]);
    return findById(id);
};
const remove = async (id) => {
    const [result] = await database_1.pool.execute('DELETE FROM Empresas WHERE Id = ?', [id]);
    return result.affectedRows > 0;
};
exports.EmpresaModel = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=EmpresaModel.js.map