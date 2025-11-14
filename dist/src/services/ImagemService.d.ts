import { Imagem, ImagemInsert, ImagemUpdate } from '../models/ImagemModel';
export declare const ImagemService: {
    create(data: ImagemInsert): Promise<Imagem>;
    list(produtoId?: number): Promise<Imagem[]>;
    findById(id: number): Promise<Imagem>;
    update(id: number, data: ImagemUpdate): Promise<Imagem>;
    remove(id: number): Promise<void>;
};
//# sourceMappingURL=ImagemService.d.ts.map