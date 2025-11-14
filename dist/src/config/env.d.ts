export declare const env: {
    port: number;
    jwtSecret: string;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
        connectionLimit: number;
        ssl: boolean;
        ca: string | undefined;
    };
};
export type DatabaseConfig = typeof env.database;
//# sourceMappingURL=env.d.ts.map