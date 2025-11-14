import { Marca, MarcaInsert, MarcaUpdate } from '../models/MarcaModel';
export declare const MarcaService: {
    create(data: MarcaInsert): Promise<Marca>;
    list(): Promise<Marca[]>;
    findById(id: number): Promise<Marca>;
    update(id: number, data: MarcaUpdate): Promise<Marca>;
    remove(id: number): Promise<void>;
};
//# sourceMappingURL=MarcaService.d.ts.map