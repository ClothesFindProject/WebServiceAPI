export interface Imagem {
    Id: number;
    UrlImg: string;
    Descricao?: string | null;
    CriadoEm?: Date | null;
    IdProduto: number;
    created_at?: Date | null;
}
export type ImagemInsert = Omit<Imagem, 'Id'>;
export type ImagemUpdate = Partial<Omit<Imagem, 'Id'>>;
export declare const ImagemModel: {
    create: (imagem: ImagemInsert) => Promise<Imagem>;
    findAll: () => Promise<Imagem[]>;
    findById: (id: number) => Promise<Imagem | null>;
    findByProdutoId: (produtoId: number) => Promise<Imagem[]>;
    update: (id: number, data: ImagemUpdate) => Promise<Imagem | null>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=ImagemModel.d.ts.map