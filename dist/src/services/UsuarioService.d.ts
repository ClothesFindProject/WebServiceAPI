import { UsuarioInsert, UsuarioUpdate, Usuario } from '../models/UsuarioModel';
import { MenuTree } from '../models/MenuModel';
type RegisterRequired = Pick<UsuarioInsert, 'Nome' | 'SobreNome' | 'CpfCnpj'>;
export type RegisterUsuarioDTO = RegisterRequired & Partial<Omit<UsuarioInsert, keyof RegisterRequired | 'Senha'>> & {
    Senha: string;
};
export type LoginDTO = {
    CpfCnpj: string;
    Senha: string;
};
export type UsuarioWithMenu = {
    usuario: Omit<Usuario, 'Senha'>;
    menu: MenuTree | null;
};
export declare const UsuarioService: {
    register(data: RegisterUsuarioDTO): Promise<Omit<Usuario, "Senha">>;
    login({ CpfCnpj, Senha }: LoginDTO): Promise<{
        usuario: Omit<Usuario, "Senha">;
        menu: MenuTree | null;
        token: string;
    }>;
    findAll(): Promise<UsuarioWithMenu[]>;
    findById(id: number): Promise<UsuarioWithMenu>;
    update(id: number, data: UsuarioUpdate): Promise<Omit<Usuario, "Senha">>;
    remove(id: number): Promise<void>;
};
export {};
//# sourceMappingURL=UsuarioService.d.ts.map