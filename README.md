# Santuy

Santuy is a nextjs framework and SQL for auto generate data from model

> **You are viewing docs for the v1 of santuy**

**Features**:

- Migrate database from model schema
- Powerful TypeScript support
- Built-in async validation support
- Built-in Database Transaction support (automatic rollback if sql fails)
- Extensible: add your own component / SQL

## Getting Started

### Installation

```ts
//create database santuy
CREATE DATABASE `santuy`;

```
### Model

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

```ts
//file: api/migrate/route.ts
//url: http://localhost:3000/api/migrate
import { models } from '@/models/models'
import { NextResponse } from 'next/server'
import { NextRequest } from "next/server"
import { DatabaseType, migrate, MigrateType } from 'santuy'

export async function GET(request: NextRequest) {
    let dev = process.env.ENV == "development" || false;
    if(!dev){
        return NextResponse.json("Migration not allowed!", { status: 400 })
    }

    let database: DatabaseType = {
        host: "localhost",
        user: "root",
        password: "",
        port: 3306,
        database: "santuy",
    }
    let mig: MigrateType = {
        models,
        database
    }
    let response: any = await migrate(mig);
    if (!response) {
        return NextResponse.json("Migration error!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```



### Seed

```ts
//file: api/seed/route.ts
//url: http://localhost:3000/api/seed?model=users
//url: http://localhost:3000/api/seed?model=categories
//url: http://localhost:3000/api/seed?model=products
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { DatabaseType, seed, SeedType } from 'santuy';
import path from 'path';

export async function GET(request: NextRequest) {
    let dev = process.env.ENV == "development" || false;
    if(!dev){
        return NextResponse.json("Seed not allowed!", { status: 400 })
    }

    const database: DatabaseType = {
        host: "localhost",
        user: "root",
        password: "",
        port: 3306,
        database: "santuy",
    }

    const model = request.nextUrl.searchParams.get("model") || "";
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
    return NextResponse.json(response, { status: 200 })
}
```

### Get Data

```ts
//file: api/get/route.ts
//url: http://localhost:3000/api/get?model=users
//url: http://localhost:3000/api/get?model=categories
//url: http://localhost:3000/api/get?model=products
import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { DatabaseType, get, GetType } from 'santuy';

export async function GET(request: NextRequest) {
    const database: DatabaseType = {
        host: "localhost",
        user: "root",
        password: "",
        port: 3306,
        database: "santuy",
    }

    const model = request.nextUrl.searchParams.get("model") || "";
    const getData: GetType = {
        model,
        database
    }
    const response: any = await get(getData);
    if (!response) {
        return NextResponse.json("No Data!", { status: 400 })
    }
    return NextResponse.json(response, { status: 200 })
}
```