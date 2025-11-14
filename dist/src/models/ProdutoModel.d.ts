export interface Produto {
    Id: number;
    CodigoInterno: string;
    NomeProduto: string;
    Descricao?: string | null;
    Genero?: string | null;
    Estilo?: string | null;
    Modelo?: string | null;
    Composicao?: string | null;
    Peso?: number | null;
    Altura?: number | null;
    Largura?: number | null;
    Tags: string[];
    Ativo: boolean;
    DataCriacao?: Date | null;
    DataAtualizacao?: Date | null;
    CurtidasTotal?: number | null;
    UltimaCurtidaEm?: Date | null;
    IdEmpresa: number;
    IdMarca?: number | null;
    created_at?: Date | null;
}
export type ProdutoInsert = Omit<Produto, 'Id'>;
export type ProdutoUpdate = Partial<Omit<Produto, 'Id'>>;
export declare const ProdutoModel: {
    create: (produto: ProdutoInsert) => Promise<Produto>;
    findAll: () => Promise<Produto[]>;
    findById: (id: number) => Promise<Produto | null>;
    findByEmpresaId: (empresaId: number) => Promise<Produto[]>;
    update: (id: number, data: ProdutoUpdate) => Promise<Produto | null>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=ProdutoModel.d.ts.map