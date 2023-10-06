export interface DatabaseType {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
}

export interface MigrateType {
    response: any;
    models: any;
    database: DatabaseType;
}

export interface SeedType {
    response: any;
    seed: string;
    path: string;
    database: DatabaseType;
}

export interface GetType {
    response: any;
    model: string;
    database: DatabaseType;
}
