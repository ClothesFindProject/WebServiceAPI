"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, ApiError);
    }
    static badRequest(message, details) {
        return new ApiError(400, message, details);
    }
    static unauthorized(message = 'Não autorizado') {
        return new ApiError(401, message);
    }
    static notFound(message) {
        return new ApiError(404, message);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map