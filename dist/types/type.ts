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
    relation?: RelationType;
}

type InputType = 'text' | 'number' | 'password' | 'email' | 'select' | 'textarea' | 'file' | 'image' | 'hidden' | 'checkbox';
export interface IncludeType {
    model: ModelType;
    relation: string;
}

export interface RelationType {
    field: string;
    reference: string;
    select: string;
}

export interface MigrateType {
    models: any;
}

export interface SeedType {
    model: ModelType;
    path: string;
}

export interface GetType {
    model: ModelType;
    paginate?: PaginateType | null;
}

export interface DetailType {
    model: ModelType;
    id: number | string;
}

export interface CreateType {
    model: ModelType;
    data: any;
}

export interface UpdateType {
    model: ModelType;
    data: any;
    id: number | string;
}

export interface RemoveType {
    model: ModelType;
    id: number | string;
}

export interface RestoreType {
    model: ModelType;
    id: number | string;
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


