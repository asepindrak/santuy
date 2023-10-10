# Santuy

Santuy is a nodejs framework and database generator from model schema.

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

[use lowercase underscores for model name and column name]

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


module.exports = UsersModel


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


module.exports = CategoriesModel


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


module.exports = ProductsModel


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
[*if migration fails with relations, try to reorder models list from models/schema.js]

### Seed
```bash
npx santuy generate seed [model_name]
```
### Example Seed
```bash
npx santuy generate seed users
```
#### users.json
[seed users (file: santuy/seeds/users.json)]
```json
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



### API SETUP
#### Express JS example

[routes/index]

```js
var express = require('express')
var router = express.Router()
const { models } = require("../santuy/schema")
const { get, detail, create, update, remove, restore, raw } = require("santuy")


/* GET DATA. */
/* GET: http://localhost:3000/?model=users */
router.get('/', async function (req, res, next) {
  const modelName = req.query.model
  let page = req.query.page ?? ""
  let limit = req.query.limit ?? "10"
  const model = models[modelName]
  page = parseInt(page)
  limit = parseInt(limit)
  let payload = {
    model,
    paginate: page ? {
      page,
      limit
    } : null
  }
  const response = await get(payload)
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

/* GET DETAIL DATA. */
/* GET: http://localhost:3000/1/?model=users */
router.get('/:id', async function (req, res, next) {
  let id = req.params.id ?? ""
  const modelName = req.query.model
  const model = models[modelName]
  let payload = {
    model,
    id
  }
  const response = await detail(payload)
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

/* CREATE DATA. */
/* POST: http://localhost:3000/?model=users */
router.post('/', async function (req, res, next) {
  const modelName = req.query.model
  const model = models[modelName]
  const data = req.body
  let payload = {
    model,
    data
  }
  const response = await create(payload)
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

/* UPDATE DATA. */
/* PUT: http://localhost:3000/1/?model=users */
router.put('/:id', async function (req, res, next) {
  let id = req.params.id ?? ""
  const modelName = req.query.model
  const model = models[modelName]
  const data = req.body
  let payload = {
    model,
    data,
    id
  }
  const response = await update(payload)
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

/* DELETE DATA. */
/* DELETE: http://localhost:3000/1/?model=users */
router.delete('/:id', async function (req, res, next) {
  let id = req.params.id ?? ""
  const modelName = req.query.model
  const model = models[modelName]
  let payload = {
    model,
    id
  }
  const response = await remove(payload)
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

/* RESTORE DATA. */
/* PUT: http://localhost:3000/restore/1/?model=users */
router.put('/restore/:id', async function (req, res, next) {
  let id = req.params.id ?? ""
  const modelName = req.query.model
  const model = models[modelName]
  let payload = {
    model,
    id
  }
  const response = await restore(payload)
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

module.exports = router

```

[routes/query]
```js
var express = require('express')
var router = express.Router()
const { raw } = require("santuy")

/* RAW QUERY. */
/* GET: http://localhost:3000/query/raw/ */
router.get('/raw', async function (req, res, next) {

  const response = await raw("SELECT * FROM users")
  if (response) {
    res.send(response)

  } else {
    res.send({ message: "error" })
  }
})

module.exports = router

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