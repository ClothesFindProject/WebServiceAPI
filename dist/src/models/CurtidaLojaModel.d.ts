export interface CurtidaLoja {
    Id: number;
    IdUsuario: number;
    IdEmpresa: number;
    DataCriacao?: Date | null;
    Origem?: string | null;
    IP?: string | null;
    UserAgent?: string | null;
    Ativo: boolean;
    created_at?: Date | null;
}
export type CurtidaLojaInsert = Omit<CurtidaLoja, 'Id'>;
export type CurtidaLojaUpdate = Partial<Omit<CurtidaLoja, 'Id'>>;
export declare const CurtidaLojaModel: {
    create: (data: CurtidaLojaInsert) => Promise<CurtidaLoja>;
    findAll: () => Promise<CurtidaLoja[]>;
    findById: (id: number) => Promise<CurtidaLoja | null>;
    findByUsuario: (usuarioId: number) => Promise<CurtidaLoja[]>;
    findByEmpresa: (empresaId: number) => Promise<CurtidaLoja[]>;
    findByUsuarioEmpresa: (usuarioId: number, empresaId: number) => Promise<CurtidaLoja | null>;
    update: (id: number, data: CurtidaLojaUpdate) => Promise<CurtidaLoja | null>;
    setAtivoByUsuarioEmpresa: (usuarioId: number, empresaId: number, ativo: boolean) => Promise<boolean>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=CurtidaLojaModel.d.ts.map