export interface DatabaseType {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
}

export interface MigrateType {
    request: any;
    models: any;
    database: DatabaseType;
}

export interface SeedType {
    request: any;
    seed: string;
    path: string;
    database: DatabaseType;
}

export interface GetType {
    request: any;
    model: string;
    database: DatabaseType;
}
