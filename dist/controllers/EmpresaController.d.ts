import { NextFunction, Request, Response } from 'express';
export declare const EmpresaController: {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    list(_req: Request, res: Response, next: NextFunction): Promise<void>;
    findById(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    remove(req: Request, res: Response, next: NextFunction): Promise<void>;
    associateUsuario(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=EmpresaController.d.ts.map