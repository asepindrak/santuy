import { createPool } from "mysql2"
import { DatabaseType } from "../types/type"
import 'dotenv/config'
import { parseDb } from "../utils/util"

class Database {
    private host: string
    private user: string
    private password: string
    private port: number
    private database: string
    private pool: any
    constructor() {
        let dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            console.error('No DATABASE_URL set\n\n')
            console.log("set DATABASE_URL in .env file\n\n")
            console.log("example:\n")
            console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"')
            return;
        }
        let database: DatabaseType = parseDb(dbUrl)
        this.host = database.host
        this.user = database.user
        this.password = database.password
        this.port = database.port
        this.database = database.database
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
    }

    public executeQuery = (query: any, params: Array<string | number> = []) => {
        return new Promise((resolve, reject) => {
            try {
                this.pool.query(query, params, (err: any, data: unknown) => {
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
