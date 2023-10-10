# Santuy

Santuy is a nextjs framework and SQL for auto generate data from model

> **You are viewing docs for the v1 of santuy**

**Features**:

- Mysql and Postgresql support
- Migrate database from model schema (automatic sync table)
- Database Relation & include support
- Database Seed support
- Built-in ACID Transaction support (automatic rollback if query fails)
- Built-in CRUD
- Raw query support
- Built-in pagination
- Powerful TypeScript support
- Built-in async validation support
- Built-in component & utils

### ACID Transaction support between PostgreSQL and MySQL

#### Mysql
1. DML (Yes)
2. DDL (Mysql < 8 (No) / Mysql > 8 (Single statement atomic DDL))

#### Postgresql
1. DML (Yes)
2. DDL (Yes)

## Getting Started

```bash
npm i santuy
```

### Santuy Commands
```bash
init "Generate santuy directory"
migrate "Database migration & sync"
seed "Database seeder"
generate "Generate model or seed"
```

### Installation


```sql
-- create database
CREATE DATABASE `database_name`;

```

#### modify tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@santuy/*": [
        "./santuy/*"
      ],
    }
  }
}
```

```bash
npx santuy init
```

### Generate Model

```bash
npx santuy generate model [model_name]
```

### Models Example

```bash
npx santuy generate model users
```

[use lowercase for model name and column name]

#### users.js:

```js
//model users (file: santuy/models/users.js)

const UsersModel = {
    name: 'users',
    icon: 'AiFillCaretRight',
    columns: [
        {
            name: 'id',
            title: 'ID',
            dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
            inputType: 'number',
        },
        {
            name: 'username',
            title: 'Username',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'text',
        },
        {
            name: 'password',
            title: 'Password',
            dataType: 'VARCHAR(255) NULL',
            inputType: 'password',
        },
        {
            name: 'name',
            title: 'Name',
            dataType: 'VARCHAR(30) NULL',
            inputType: 'text',
        },
        {
            name: 'avatar',
            title: 'Avatar',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'image',
        },
        {
            name: 'address',
            title: 'Address',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'textarea',
        },
    ],
}

export default UsersModel

```

```bash
npx santuy generate model categories
```
#### categories.js:
```js
//model categories (file: santuy/models/categories.js)

const CategoriesModel = {
    name: 'categories',
    icon: 'AiFillCaretRight',
    columns: [
        {
            name: 'id',
            title: 'ID',
            dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
            inputType: 'number',
        },
        {
            name: 'name',
            title: 'Category Name',
            dataType: 'VARCHAR(50) NULL',
            inputType: 'text',
        },
    ],
}


export default CategoriesModel

```

```bash
npx santuy generate model products
```
#### products.js:
```js
//model products (file: santuy/models/products.js)

const ProductsModel = {
    name: 'products',
    icon: 'AiFillCaretRight',
    columns: [
        {
            name: 'id',
            title: 'ID',
            dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
            inputType: 'number',
        },
        {
            name: 'category_id',
            title: 'Category',
            dataType: 'INT NULL',
            inputType: 'select',
            selectData: "categories",
            relation: {
                field: 'category_id',
                reference: 'categories.id',
                select: 'categories.name'
            },
        },
        {
            name: 'name',
            title: 'Item Name',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'text',
        },
        {
            name: 'plu',
            title: 'PLU',
            dataType: 'VARCHAR(50) NULL',
            inputType: 'text',
        },
        {
            name: 'unit',
            title: 'Unit',
            dataType: 'VARCHAR(30) NULL',
            inputType: 'text',
        },
        {
            name: 'cost',
            title: 'Cost',
            dataType: 'INT NULL',
            inputType: 'number',
        },
        {
            name: 'price',
            title: 'Price',
            dataType: 'INT NULL',
            inputType: 'number',
        },
        {
            name: 'qty',
            title: 'Qty',
            dataType: 'INT NULL',
            inputType: 'number',
        },
    ]
}


export default ProductsModel

```

### .env file
[mysql]
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

[postgresql]
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

### .env file example mysql
```
DATABASE_URL="mysql://root:@localhost:3306/database_name"
```

### .env file example postgresql
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/database_name"
```

### Database Migration & Sync
```bash
npx santuy migrate
```


### Seed
```bash
npx santuy generate seed [model_name]
```
### Example Seed
```bash
npx santuy generate seed users
```
#### users.json
```json
//seed users (file: santuy/seeds/users.json)
[
    {
        "username": "admin",
        "password": "admin123",
        "name": "Admin",
        "avatar": "https://ui-avatars.com/api/?name=Admin%20Dashboard",
        "address": "Jl. Ahmad Yani No. 790"
    }
]
```

#### example seeding users
```bash
npx santuy seed users
```



### API SETUP FOR NEXTJS

### Get Data

```ts
//file: api/get/route.ts
//GET: http://localhost:3000/api/get/?model=users
//Pagination -> GET: http://localhost:3000/api/get/?model=users&page=1&limit=10
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { GetType, get, ModelType } from 'santuy';
import { models } from '@santuy/schema.js'

export async function GET(request: NextRequest) {
    const modelName = request.nextUrl.searchParams.get("model") ?? "";
    const mod: any = models;
    const model: ModelType = mod[modelName];
    let page: any = request.nextUrl.searchParams.get("page") ?? "0";
    let limit: any = request.nextUrl.searchParams.get("limit") ?? "10";
    page = parseInt(page);
    limit = parseInt(limit);
    let getData: GetType = {
        model,
        paginate: page ? {
            page,
            limit
        } : null
    }
    const response: any = await get(getData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```



### Get Detail

```ts
//file: api/detail/route.ts
//GET: http://localhost:3000/api/detail/?model=users&id=1
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { DetailType, ModelType, detail } from 'santuy';
import { models } from '@santuy/schema.js'

export async function GET(request: NextRequest) {

    const modelName = request.nextUrl.searchParams.get("model") ?? "";
    const mod: any = models;
    const model: ModelType = mod[modelName];
    let id: any = request.nextUrl.searchParams.get("id");
    let detailData: DetailType = {
        model,
        id: parseInt(id) ?? null
    }
    const response: any = await detail(detailData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```

### Create

```ts
//file: api/create/route.ts
//POST: http://localhost:3000/api/create/?model=users
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { CreateType, ModelType, create } from 'santuy';
import { models } from '@santuy/schema.js'

export async function POST(request: NextRequest) {
    const modelName = request.nextUrl.searchParams.get("model") ?? "";
    const mod: any = models;
    const model: ModelType = mod[modelName];
    const data = await request.json();
    let createData: CreateType = {
        model,
        data
    }
    const response: any = await create(createData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```

### Update

```ts
//file: api/update/route.ts
//PUT: http://localhost:3000/api/update/?model=users&id=1
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { ModelType, UpdateType, update } from 'santuy';
import { models } from '@santuy/schema.js'

export async function PUT(request: NextRequest) {

    const modelName = request.nextUrl.searchParams.get("model") ?? "";
    const mod: any = models;
    const model: ModelType = mod[modelName];
    const id = request.nextUrl.searchParams.get("id") ?? "";
    const data = await request.json();

    let updateData: UpdateType = {
        model,
        data,
        id: parseInt(id)
    }
    const response: any = await update(updateData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```

### Remove

```ts
//file: api/remove/route.ts
//DELETE: http://localhost:3000/api/remove/?model=users&id=1
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { ModelType, RemoveType, remove } from 'santuy';
import { models } from '@santuy/schema.js'

export async function DELETE(request: NextRequest) {

    const modelName = request.nextUrl.searchParams.get("model") ?? "";
    const mod: any = models;
    const model: ModelType = mod[modelName];
    const id = request.nextUrl.searchParams.get("id") ?? "";

    let removeData: RemoveType = {
        model,
        id: parseInt(id)
    }
    const response: any = await remove(removeData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```

### Restore

```ts
//file: api/restore/route.ts
//PUT: http://localhost:3000/api/restore/?model=users&id=1
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { ModelType, RestoreType, restore } from 'santuy';
import { models } from '@santuy/schema.js'

export async function PUT(request: NextRequest) {

    const modelName = request.nextUrl.searchParams.get("model") ?? "";
    const mod: any = models;
    const model: ModelType = mod[modelName];
    const id = request.nextUrl.searchParams.get("id") ?? "";

    let restoreData: RestoreType = {
        model,
        id: parseInt(id)
    }
    const response: any = await restore(restoreData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```

### Raw Query

```ts
//file: api/raw/route.ts
//PUT: http://localhost:3000/api/raw/?id=1
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { raw } from 'santuy'

export async function GET(request: NextRequest) {
    let id: any = request.nextUrl.searchParams.get("id");
    if (!id) {
        return NextResponse.json("error: id not define", { status: 400 })
    }
    let query: string = `SELECT * FROM users WHERE id = ${id}`
    let response = await raw(query);
    return NextResponse.json(response, { status: 200 })
}
```

### Types
```ts
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

```