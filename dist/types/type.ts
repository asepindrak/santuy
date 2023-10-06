export interface DatabaseType {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
}

export interface MigrateType {
    models: any;
    database: DatabaseType;
}

export interface SeedType {
    model: string;
    path: string;
    database: DatabaseType;
}

export interface GetType {
    model: string;
    database: DatabaseType;
}
