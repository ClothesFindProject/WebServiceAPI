import { NextFunction, Request, Response } from 'express';
export declare const UsuarioController: {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    list(_req: Request, res: Response, next: NextFunction): Promise<void>;
    findById(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    remove(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=UsuarioController.d.ts.map