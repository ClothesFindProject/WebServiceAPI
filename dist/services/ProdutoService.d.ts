import { Produto, ProdutoInsert, ProdutoUpdate } from '../models/ProdutoModel';
import { Marca } from '../models/MarcaModel';
export type ProdutoDetalhado = Produto & {
    MarcaInfo: Marca | null;
    EmpresaNome: string | null;
};
export declare const ProdutoService: {
    create(data: ProdutoInsert): Promise<ProdutoDetalhado>;
    list(): Promise<ProdutoDetalhado[]>;
    findById(id: number): Promise<ProdutoDetalhado>;
    update(id: number, data: ProdutoUpdate): Promise<ProdutoDetalhado>;
    remove(id: number): Promise<void>;
};
//# sourceMappingURL=ProdutoService.d.ts.map