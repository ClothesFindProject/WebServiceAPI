import { Produto, ProdutoInsert, ProdutoUpdate } from '../models/ProdutoModel';
import { Marca } from '../models/MarcaModel';
import { Imagem } from '../models/ImagemModel';
export type ProdutoDetalhado = Produto & {
    MarcaInfo: Marca | null;
    EmpresaNome: string | null;
    Imagens?: Imagem[];
};
export declare const ProdutoService: {
    create(data: ProdutoInsert & {
        Imagens?: Array<{
            UrlImg?: string;
            Descricao?: string | null;
        }>;
    }, files?: Express.Multer.File[]): Promise<ProdutoDetalhado>;
    list(): Promise<ProdutoDetalhado[]>;
    findById(id: number): Promise<ProdutoDetalhado>;
    update(id: number, data: ProdutoUpdate): Promise<ProdutoDetalhado>;
    remove(id: number): Promise<void>;
};
//# sourceMappingURL=ProdutoService.d.ts.map