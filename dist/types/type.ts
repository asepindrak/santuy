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
    paginate?: PaginateType | null;
}

export interface CreateType {
    model: string;
    database: DatabaseType;
    data: any;
}

export interface UpdateType {
    model: string;
    database: DatabaseType;
    data: any;
    id: number;
}

export interface RemoveType {
    model: string;
    database: DatabaseType;
    id: number;
}

export interface RawType {
    database: DatabaseType;
    query: string,
    params?: Array<string | number>
}

export interface TransactionType {
    database: DatabaseType;
}

export interface PaginateType {
    page: number;
    limit: number;
    model?: string | null;
}

export interface ResultType {
    data: Array<Object | null> | null;
    page: number;
    limit: number;
    total: number;
}
