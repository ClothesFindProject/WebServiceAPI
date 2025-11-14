import { Empresa, EmpresaInsert, EmpresaUpdate } from '../models/EmpresaModel';
import type { ProdutoDetalhado } from './ProdutoService';
export type EmpresaDetalhada = Empresa & {
    Produtos: ProdutoDetalhado[];
};
export declare const EmpresaService: {
    create(data: EmpresaInsert): Promise<Empresa>;
    list(): Promise<EmpresaDetalhada[]>;
    findById(id: number): Promise<EmpresaDetalhada>;
    update(id: number, data: EmpresaUpdate): Promise<Empresa>;
    remove(id: number): Promise<void>;
    associateUsuario(empresaId: number, usuarioId: number): Promise<{
        empresa: Empresa;
        usuario: {
            Id: number;
            Nome: string;
            SobreNome: string;
            CpfCnpj: string;
            Telefone?: string | null;
            Telefone2?: string | null;
            Pais?: string | null;
            UF?: string | null;
            Cidade?: string | null;
            Bairro?: string | null;
            Rua?: string | null;
            Empresa?: string | null;
            Ativo: boolean;
            ProximaExpiracao?: Date | null;
            DataCriacao?: Date;
            DataInativacao?: Date | null;
            IdMenu?: number | null;
            EmpresaId?: number | null;
            created_at?: Date;
        };
    }>;
};
//# sourceMappingURL=EmpresaService.d.ts.map