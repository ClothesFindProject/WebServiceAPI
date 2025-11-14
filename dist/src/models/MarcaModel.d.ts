export interface Marca {
    Id: number;
    Nome: string;
    Site?: string | null;
    Ativo: boolean;
    ImgMarca?: string | null;
    created_at?: Date | null;
}
export type MarcaInsert = Omit<Marca, 'Id'>;
export type MarcaUpdate = Partial<Omit<Marca, 'Id'>>;
export declare const MarcaModel: {
    create: (data: MarcaInsert) => Promise<Marca>;
    findAll: () => Promise<Marca[]>;
    findById: (id: number) => Promise<Marca | null>;
    update: (id: number, data: MarcaUpdate) => Promise<Marca | null>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=MarcaModel.d.ts.map