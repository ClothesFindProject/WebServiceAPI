import { Marca, MarcaInsert, MarcaUpdate } from '../models/MarcaModel';
export declare const MarcaService: {
    create(data: MarcaInsert, file?: Express.Multer.File): Promise<Marca>;
    list(): Promise<Marca[]>;
    findById(id: number): Promise<Marca>;
    update(id: number, data: MarcaUpdate, file?: Express.Multer.File): Promise<Marca>;
    changeStatus(id: number, ativo: unknown): Promise<Marca>;
    remove(id: number): Promise<void>;
};
//# sourceMappingURL=MarcaService.d.ts.map