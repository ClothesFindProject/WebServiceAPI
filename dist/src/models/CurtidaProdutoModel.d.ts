export interface CurtidaProduto {
    Id: number;
    IdUsuario: number;
    IdProduto: number;
    DataCriacao?: Date | null;
    Origem?: string | null;
    IP?: string | null;
    UserAgent?: string | null;
    Ativo: boolean;
    created_at?: Date | null;
}
export type CurtidaProdutoInsert = Omit<CurtidaProduto, 'Id'>;
export type CurtidaProdutoUpdate = Partial<Omit<CurtidaProduto, 'Id'>>;
export declare const CurtidaProdutoModel: {
    create: (data: CurtidaProdutoInsert) => Promise<CurtidaProduto>;
    findAll: () => Promise<CurtidaProduto[]>;
    findById: (id: number) => Promise<CurtidaProduto | null>;
    findByUsuario: (usuarioId: number) => Promise<CurtidaProduto[]>;
    findByProduto: (produtoId: number) => Promise<CurtidaProduto[]>;
    findByUsuarioProduto: (usuarioId: number, produtoId: number) => Promise<CurtidaProduto | null>;
    update: (id: number, data: CurtidaProdutoUpdate) => Promise<CurtidaProduto | null>;
    setAtivoByUsuarioProduto: (usuarioId: number, produtoId: number, ativo: boolean) => Promise<boolean>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=CurtidaProdutoModel.d.ts.map