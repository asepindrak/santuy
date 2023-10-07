# Santuy

Santuy is a nextjs framework and SQL for auto generate data from model

> **You are viewing docs for the v1 of santuy**

**Features**:

- Migrate database from model schema (automatic truncate table)
- DB Seed support
- Powerful TypeScript support
- Built-in async validation support
- Relation & include support
- Built-in Database Transaction support (automatic rollback if query fails)
- Built-in pagination
- Built-in component & utils (under development)
- Extensible: add your own component and query

## Getting Started

### Installation

```ts
//create database santuy
CREATE DATABASE `santuy`;

```
### Models Example

```ts
//model (models/models.ts)
import { ProductModel } from "./product-model";
import { UserModel } from "./user-model";
import { CategoryModel } from "./category-model";

//define all models
const models: any = {
    'categories': CategoryModel,
    'products': ProductModel,
    'users': UserModel,
}


export { models }
```

```ts
//model users (file: models/user-model.ts)
const UserModel = {
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
};


export { UserModel }
```

```ts
//model categories (file: models/category-model.ts)
const CategoryModel = {
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
            dataType: 'VARCHAR(100) NULL',
            inputType: 'text',
        },
    ],
};

export { CategoryModel }
```

```ts
//model products (file: models/product-model.ts)
const ProductModel = {
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
            relation: 'categories.id'
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
    ],
    includes: [
        {
            model: 'categories',
            relation: 'categoryId'
        }
    ]
};

export { ProductModel }
```




### Migration

```Santuy CLI DB Migration is under development!```

```ts
//file: api/migrate/route.ts
//GET: http://localhost:3000/api/migrate
import { dev } from '@/config/config';
import { database } from '@/config/db';
import { models } from '@/models/models';
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { migrate, MigrateType } from 'santuy';

export async function GET(request: NextRequest) {
    if (!dev) {
        return NextResponse.json("Migration not allowed!", { status: 400 })
    }
    const mig: MigrateType = {
        models,
        database
    }
    const response: any = await migrate(mig);
    if (!response) {
        return NextResponse.json("Migration error!", { status: 400 })
    }
    return NextResponse.json("Migration successfully", { status: 200 })
}
```



### Seed

```Santuy CLI DB Seed is under development!```

```ts
//file: api/seed/route.ts
//GET: http://localhost:3000/api/seed?model=users
//GET: http://localhost:3000/api/seed?model=categories
//GET: http://localhost:3000/api/seed?model=products
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { seed, SeedType } from 'santuy';
import path from 'path';
import { database } from '@/config/db';
import { dev } from '@/config/config';

export async function GET(request: NextRequest) {
    if (!dev) {
        return NextResponse.json("Seed not allowed!", { status: 400 })
    }
    const model = request.nextUrl.searchParams.get("model") ?? "";
    const jsonPath = path.join(process.cwd(), 'src/seeds');
    const seeder: SeedType = {
        model,
        path: jsonPath,
        database
    }
    const response: any = await seed(seeder);
    if (!response) {
        return NextResponse.json("Seeding error!", { status: 400 })
    }
    return NextResponse.json("Seeding successfully", { status: 200 })
}
```

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