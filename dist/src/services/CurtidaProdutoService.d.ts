import { CurtidaProduto, CurtidaProdutoInsert, CurtidaProdutoUpdate } from '../models/CurtidaProdutoModel';
import { Produto } from '../models/ProdutoModel';
type ListFilters = {
    usuarioId?: number | undefined;
    produtoId?: number | undefined;
};
export declare const CurtidaProdutoService: {
    create(data: CurtidaProdutoInsert): Promise<CurtidaProduto>;
    list(filters?: ListFilters): Promise<CurtidaProduto[]>;
    findById(id: number): Promise<CurtidaProduto>;
    update(id: number, data: CurtidaProdutoUpdate): Promise<CurtidaProduto>;
    remove(id: number): Promise<void>;
    validateCurtida(usuarioId: number, produtoId: number): Promise<{
        existe: boolean;
        ativo: boolean;
    }>;
    deactivateCurtida(usuarioId: number, produtoId: number): Promise<CurtidaProduto>;
    listProdutosCurtidos(usuarioId: number): Promise<Produto[]>;
};
export {};
//# sourceMappingURL=CurtidaProdutoService.d.ts.map