import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';

export interface Menu {
  Id: number;
  Nome: string;
  Link?: string | null;
  Icone?: string | null;
  IdNivelUsuario?: number | null;
  created_at?: Date | null;
}

export interface Submenu {
  Id: number;
  Nome: string;
  Link?: string | null;
  Icone?: string | null;
  MenuId: number;
  created_at?: Date | null;
}

export interface NivelUsuario {
  Id: number;
  Nivel: string;
  Descricao?: string | null;
  created_at?: Date | null;
}

export interface MenuTree extends Menu {
  submenus: Submenu[];
  nivel?: NivelUsuario | null;
}

const rowToMenu = (row: RowDataPacket): Menu => {
  const menu: Menu = {
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

const rowToSubmenu = (row: RowDataPacket): Submenu => {
  const submenu: Submenu = {
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

const rowToNivel = (row: RowDataPacket): NivelUsuario => {
  const nivel: NivelUsuario = {
    Id: row.Id,
    Nivel: row.Nivel,
    Descricao: row.Descricao,
  };
  if (row.created_at) {
    nivel.created_at = new Date(row.created_at);
  }
  return nivel;
};

const findMenuById = async (id: number): Promise<Menu | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Menus WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToMenu(row);
};

const findSubmenusByMenuId = async (menuId: number): Promise<Submenu[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM Submenus WHERE MenuId = ? ORDER BY Id ASC', [menuId]);
  return rows.map(rowToSubmenu);
};

const findNivelById = async (id: number): Promise<NivelUsuario | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM NivelUsuario WHERE Id = ? LIMIT 1', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];
  if (!row) {
    return null;
  }
  return rowToNivel(row);
};

const findMenuTreeById = async (id: number): Promise<MenuTree | null> => {
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

export const MenuModel = {
  findMenuById,
  findSubmenusByMenuId,
  findNivelById,
  findMenuTreeById,
};
