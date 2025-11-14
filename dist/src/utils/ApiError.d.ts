export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    constructor(statusCode: number, message: string, details?: unknown);
    static badRequest(message: string, details?: unknown): ApiError;
    static unauthorized(message?: string): ApiError;
    static notFound(message: string): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map