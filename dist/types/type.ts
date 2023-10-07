export interface DatabaseType {
    host: string | 'localhost';
    user: string | 'root';
    password: string;
    port: number | 3306;
    database: string;
}

export interface ModelType {
    name: string;
    icon?: string;
    columns: Array<ColumnType>;
    includes?: Array<IncludeType>;
}

export interface ColumnType {
    name: 'id' | string | ModelType;
    title: string;
    dataType?: string;
    inputType?: InputType;
    selectData?: string | Array<string>;
    relation?: string;
}

type InputType = 'text' | 'number' | 'password' | 'email' | 'select' | 'textarea' | 'file' | 'image' | 'hidden' | 'checkbox';
export interface IncludeType {
    model: ModelType;
    relation: string;
}

export interface MigrateType {
    models: any;
    database: DatabaseType;
}

export interface SeedType {
    model: ModelType;
    path: string;
    database: DatabaseType;
}

export interface GetType {
    model: ModelType;
    database: DatabaseType;
    paginate?: PaginateType;
}

export interface DetailType {
    model: ModelType;
    database: DatabaseType;
    id: number | string;
}

export interface CreateType {
    model: ModelType;
    database: DatabaseType;
    data: any;
}

export interface UpdateType {
    model: ModelType;
    database: DatabaseType;
    data: any;
    id: number | string;
}

export interface RemoveType {
    model: ModelType;
    database: DatabaseType;
    id: number | string;
}

export interface RestoreType {
    model: ModelType;
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
    data: Array<Object | null> | null | false | undefined;
    page?: number;
    limit?: number;
    total?: number;
}


