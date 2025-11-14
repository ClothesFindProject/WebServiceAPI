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
export declare const MenuModel: {
    findMenuById: (id: number) => Promise<Menu | null>;
    findSubmenusByMenuId: (menuId: number) => Promise<Submenu[]>;
    findNivelById: (id: number) => Promise<NivelUsuario | null>;
    findMenuTreeById: (id: number) => Promise<MenuTree | null>;
};
//# sourceMappingURL=MenuModel.d.ts.map