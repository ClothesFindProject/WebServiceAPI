"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModel = void 0;
const database_1 = require("../config/database");
const rowToMenu = (row) => {
    const menu = {
        Id: row.Id,
        Nome: row.Nome,
        Link: row.Link,
        Icone: row.Icone,
        IdNivelUsuario: row.IdNivelUsuario,
    };
    if (row.created_at) {
        menu.created_at = new Date(row.created_at);
    }
    return menu;
};
const rowToSubmenu = (row) => {
    const submenu = {
        Id: row.Id,
        Nome: row.Nome,
        Link: row.Link,
        Icone: row.Icone,
        MenuId: row.MenuId,
    };
    if (row.created_at) {
        submenu.created_at = new Date(row.created_at);
    }
    return submenu;
};
const rowToNivel = (row) => {
    const nivel = {
        Id: row.Id,
        Nivel: row.Nivel,
        Descricao: row.Descricao,
    };
    if (row.created_at) {
        nivel.created_at = new Date(row.created_at);
    }
    return nivel;
};
const findMenuById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Menus WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToMenu(row);
};
const findSubmenusByMenuId = async (menuId) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM Submenus WHERE MenuId = ? ORDER BY Id ASC', [menuId]);
    return rows.map(rowToSubmenu);
};
const findNivelById = async (id) => {
    const [rows] = await database_1.pool.execute('SELECT * FROM NivelUsuario WHERE Id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return rowToNivel(row);
};
const findMenuTreeById = async (id) => {
    const menu = await findMenuById(id);
    if (!menu) {
        return null;
    }
    const [submenus, nivel] = await Promise.all([
        findSubmenusByMenuId(menu.Id),
        menu.IdNivelUsuario ? findNivelById(menu.IdNivelUsuario) : Promise.resolve(null),
    ]);
    return {
        ...menu,
        submenus,
        nivel,
    };
};
exports.MenuModel = {
    findMenuById,
    findSubmenusByMenuId,
    findNivelById,
    findMenuTreeById,
};
//# sourceMappingURL=MenuModel.js.map