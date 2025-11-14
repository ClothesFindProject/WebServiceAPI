"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof ApiError_1.ApiError) {
        return res.status(error.statusCode).json({
            message: error.message,
            details: error.details,
        });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (_req, res) => res.status(404).json({ message: 'Rota não encontrada' });
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map