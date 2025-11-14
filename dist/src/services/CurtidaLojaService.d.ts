import { CurtidaLoja, CurtidaLojaInsert, CurtidaLojaUpdate } from '../models/CurtidaLojaModel';
import { Empresa } from '../models/EmpresaModel';
type ListFilters = {
    usuarioId?: number | undefined;
    empresaId?: number | undefined;
};
export declare const CurtidaLojaService: {
    create(data: CurtidaLojaInsert): Promise<CurtidaLoja>;
    list(filters?: ListFilters): Promise<CurtidaLoja[]>;
    findById(id: number): Promise<CurtidaLoja>;
    update(id: number, data: CurtidaLojaUpdate): Promise<CurtidaLoja>;
    remove(id: number): Promise<void>;
    validateCurtida(usuarioId: number, empresaId: number): Promise<{
        existe: boolean;
        ativo: boolean;
    }>;
    deactivateCurtida(usuarioId: number, empresaId: number): Promise<CurtidaLoja>;
    listEmpresasCurtidas(usuarioId: number): Promise<Empresa[]>;
};
export {};
//# sourceMappingURL=CurtidaLojaService.d.ts.map