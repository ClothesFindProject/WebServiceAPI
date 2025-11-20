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
    UserImagem: string | null;
};
export declare const UsuarioService: {
    register(data: RegisterUsuarioDTO, file?: any): Promise<Omit<Usuario, "Senha">>;
    login({ CpfCnpj, Senha }: LoginDTO): Promise<{
        usuario: Omit<Usuario, "Senha">;
        menu: MenuTree | null;
        UserImagem: string | null;
        token: string;
    }>;
    findAll(): Promise<UsuarioWithMenu[]>;
    findById(id: number): Promise<UsuarioWithMenu>;
    update(id: number, data: UsuarioUpdate, file?: any): Promise<Omit<Usuario, "Senha">>;
    remove(id: number): Promise<void>;
    changeStatus(id: number, ativo: unknown): Promise<Omit<Usuario, "Senha">>;
};
export {};
//# sourceMappingURL=UsuarioService.d.ts.map