# Santuy

Santuy is a nextjs framework and SQL for auto generate data from model

> **You are viewing docs for the v1 of santuy**

**Features**:

- Migrate database from model schema (automatic sync table)
- DB Seed support
- Powerful TypeScript support
- Built-in async validation support
- Relation & include support
- Built-in Database Transaction support (automatic rollback if query fails)
- Built-in CRUD
- Built-in pagination
- Built-in component & utils
- Raw query support

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
#### users.mjs:

```js
//model users (file: santuy/models/users.mjs)

const UsersModel = {
    name: 'users',
    icon: 'AiOutlineUser',
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
            dataType: 'VARCHAR(30) NULL',
            inputType: 'text',
        },
        {
            name: 'password',
            title: 'Password',
            dataType: 'VARCHAR(100) NULL',
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
            dataType: 'TEXT NULL',
            inputType: 'image',
        },
        {
            name: 'address',
            title: 'Address',
            dataType: 'TEXT NULL',
            inputType: 'textarea',
        },
    ],
};


export default UsersModel

```

```bash
npx santuy generate model categories
```
#### categories.mjs:
```js
//model categories (file: santuy/models/categories.mjs)
const CategoriesModel = {
    name: 'categories',
    icon: 'AiOutlineFileAdd',
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
            dataType: 'VARCHAR(30) NULL',
            inputType: 'text',
        },
    ],
};

export default CategoriesModel
```

```bash
npx santuy generate model products
```
#### products.mjs:
```js
//model products (file: santuy/models/products.mjs)
const ProductsModel = {
    name: 'products',
    icon: 'AiOutlineFileAdd',
    columns: [
        {
            name: 'id',
            title: 'ID',
            dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
            inputType: 'number',
        },
        {
            name: 'categoryId',
            title: 'Category',
            dataType: 'INT NULL',
            inputType: 'select',
            selectData: "categories",
            relation: {
                field: 'categoryId',
                reference: 'categories.id',
                select: 'categories.name'
            },
        },
        {
            name: 'name',
            title: 'Item Name',
            dataType: 'VARCHAR(50) NULL',
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
};

export default ProductsModel
```


### .env file
```
DATABASE_URL="mysql://root:@localhost:3306/database_name"
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
import { database } from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { GetType, get } from 'santuy';

export async function GET(request: NextRequest) {

    const model = request.nextUrl.searchParams.get("model") ?? "";
    let page: any = request.nextUrl.searchParams.get("page") ?? "0";
    let limit: any = request.nextUrl.searchParams.get("limit") ?? "10";
    page = parseInt(page);
    limit = parseInt(limit);
    let getData: GetType = {
        model,
        database,
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
import { database } from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { DetailType, detail } from 'santuy';

export async function GET(request: NextRequest) {

    const model = request.nextUrl.searchParams.get("model") ?? "";
    let id: any = request.nextUrl.searchParams.get("id");
    let detailData: DetailType = {
        model,
        database,
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
import { database } from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { CreateType, create } from 'santuy';

export async function POST(request: NextRequest) {
    const model = request.nextUrl.searchParams.get("model") ?? "";
    const data = await request.json();
    let createData: CreateType = {
        model,
        database,
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
import { database } from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { UpdateType, update } from 'santuy';

export async function PUT(request: NextRequest) {

    const model = request.nextUrl.searchParams.get("model") ?? "";
    const id = request.nextUrl.searchParams.get("id") ?? "";
    const data = await request.json();

    let updateData: UpdateType = {
        model,
        database,
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
import { database } from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { RemoveType, remove } from 'santuy';

export async function DELETE(request: NextRequest) {

    const model = request.nextUrl.searchParams.get("model") ?? "";
    const id = request.nextUrl.searchParams.get("id") ?? "";

    let removeData: RemoveType = {
        model,
        database,
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
import { database } from '@/config/db';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { RestoreType, restore } from 'santuy';

export async function PUT(request: NextRequest) {

    const model = request.nextUrl.searchParams.get("model") ?? "";
    const id = request.nextUrl.searchParams.get("id") ?? "";

    let restoreData: RestoreType = {
        model,
        database,
        id: parseInt(id)
    }
    const response: any = await restore(restoreData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
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
    paginate?: PaginateType | null;
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

```