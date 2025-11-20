export interface Usuario {
    Id: number;
    Nome: string;
    SobreNome: string;
    CpfCnpj: string;
    Telefone?: string | null;
    Telefone2?: string | null;
    Pais?: string | null;
    UF?: string | null;
    Cidade?: string | null;
    Bairro?: string | null;
    Rua?: string | null;
    Empresa?: string | null;
    Ativo: boolean;
    UserImagem?: string | null;
    ProximaExpiracao?: Date | null;
    DataCriacao?: Date;
    DataInativacao?: Date | null;
    IdMenu?: number | null;
    EmpresaId?: number | null;
    created_at?: Date;
    Senha?: string;
}
export type UsuarioInsert = Omit<Usuario, 'Id' | 'DataCriacao' | 'DataInativacao' | 'created_at'> & {
    DataCriacao?: Date;
    DataInativacao?: Date | null;
    created_at?: Date;
    Senha: string;
};
export type UsuarioUpdate = Partial<Omit<Usuario, 'Id'>>;
export declare const UsuarioModel: {
    create: (usuario: UsuarioInsert) => Promise<Usuario>;
    findByCpfCnpj: (cpfCnpj: string) => Promise<Usuario | null>;
    findById: (id: number) => Promise<Usuario | null>;
    findAll: () => Promise<Usuario[]>;
    update: (id: number, data: UsuarioUpdate) => Promise<Usuario | null>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=UsuarioModel.d.ts.map