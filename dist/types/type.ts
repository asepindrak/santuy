export interface DatabaseType {
    host: string | 'localhost';
    user: string | 'root';
    password: string;
    port: number | 3306;
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

export interface DetailType {
    model: string;
    database: DatabaseType;
    id: number | string;
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
    id: number | string;
}

export interface RemoveType {
    model: string;
    database: DatabaseType;
    id: number | string;
}

export interface RestoreType {
    model: string;
    database: DatabaseType;
    id: number | string;
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
}

export interface ResultType {
    data: Array<Object | null> | null;
    page?: number;
    limit?: number;
    total?: number;
}

export interface ModelType {
    name: string;
    icon?: string;
    columns: Array<ColumnType>;
    includes?: Array<IncludeType>;
}

type InputType = 'text' | 'number' | 'password' | 'email' | 'select' | 'textarea' | 'file' | 'image' | 'hidden' | 'checkbox';

export interface ColumnType {
    name: 'id' | string;
    title: string;
    dataType: string;
    inputType?: InputType;
    selectData?: string | Array<string>;
    relation?: string;
}

export interface IncludeType {
    model: string;
    relation: string;
}
