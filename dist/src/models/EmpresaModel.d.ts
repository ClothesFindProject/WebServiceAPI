export interface Empresa {
    Id: number;
    RazaoSocial: string;
    NomeFantasia?: string | null;
    InscricaoEstadual?: string | null;
    InscricaoMunicipal?: string | null;
    TipoEmpresa?: string | null;
    DataFundacao?: Date | null;
    CEP?: string | null;
    Logradouro?: string | null;
    Numero?: string | null;
    Complemento?: string | null;
    Bairro?: string | null;
    Cidade?: string | null;
    UF?: string | null;
    Pais?: string | null;
    TelefonePrincipal?: string | null;
    TelefoneSecundario?: string | null;
    Email?: string | null;
    Site?: string | null;
    LinkInstagram?: string | null;
    LinkWhatsapp?: string | null;
    LinkSite?: string | null;
    ResponsavelContato?: string | null;
    InscricaoSuframa?: string | null;
    RegimeTributario?: string | null;
    CodigoCNAE?: string | null;
    BancoPrincipal?: string | null;
    Agencia?: string | null;
    ContaBancaria?: string | null;
    Ativo: boolean;
    DataCriacao?: Date | null;
    DataAtualizacao?: Date | null;
    CriadoPor?: string | null;
    AtualizadoPor?: string | null;
    GeoX?: string | null;
    GeoY?: string | null;
    created_at?: Date | null;
}
export type EmpresaInsert = Omit<Empresa, 'Id'>;
export type EmpresaUpdate = Partial<Omit<Empresa, 'Id'>>;
export declare const EmpresaModel: {
    create: (empresa: EmpresaInsert) => Promise<Empresa>;
    findAll: () => Promise<Empresa[]>;
    findById: (id: number) => Promise<Empresa | null>;
    update: (id: number, data: EmpresaUpdate) => Promise<Empresa | null>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=EmpresaModel.d.ts.map