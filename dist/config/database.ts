import { createPool } from "mysql2"
import pg from "pg";
const { Pool } = pg;
import { DatabaseType } from "../types/type"
import 'dotenv/config'
import { parseDb, providerCheck } from "..//utils/util"

class Database {
    private host: string
    private user: string
    private password: string
    private port: number
    private database: string
    public provider: string
    private pool: any
    constructor() {
        let dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            console.error('No DATABASE_URL set\n\n')
            console.log("set DATABASE_URL in .env file\n\n")
            console.log("example:\n")
            console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"')
        }
        let provider: string = providerCheck(dbUrl ?? "")
        let database: DatabaseType = parseDb(provider, dbUrl ?? "mysql://root:@localhost:3306/santuy")
        this.host = database.host
        this.user = database.user
        this.password = database.password
        this.port = database.port
        this.database = database.database
        this.provider = provider
        if (provider == "mysql") {
            this.pool = createPool({
                host: this.host,
                user: this.user,
                password: this.password,
                port: this.port,
                database: this.database,
            })
            this.pool.getConnection((err: any) => {
                if (err) {
                    console.log("Error connecting to db...")
                }
                console.log("Connected to db...")
            })
        } else if (provider == "postgresql") {
            this.pool = new Pool({
                host: this.host,
                user: this.user,
                password: this.password,
                port: this.port,
                database: this.database,
            })

        }
    }

    public executeQuery = (query: any) => {
        return new Promise((resolve, reject) => {
            try {
                this.pool.query(query, [], (err: any, data: unknown) => {
                    if (err) {
                        console.log('ROLLBACK', err)
                        this.pool.query("ROLLBACK")
                        reject(err)
                        throw err
                    }
                    resolve(data)
                })
            } catch (error) {
            }
        })
    }

}

export default Database
