import { createPool } from "mysql2"
import { DatabaseType } from "../types/type"

class Database {
    private host: string
    private user: string
    private password: string
    private port: number
    private database: string
    private pool: any
    constructor({ host, user, password, port, database }: DatabaseType) {
        this.host = host
        this.user = user
        this.password = password
        this.port = port
        this.database = database
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

    public executeQuery = (query: any, params: Array<string | number>) => {
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
