import { createPool } from "mysql2"
import parseDb from './parse-db-url.mjs'
import 'dotenv/config'
class Database {
    host
    user
    password
    port
    database
    pool
    constructor() {
        let dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            console.error('No DATABASE_URL set\n\n')
            console.log("set DATABASE_URL in .env file\n\n")
            console.log("example:\n")
            console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"')
            return
        }
        let database = parseDb(dbUrl)
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
        this.pool.getConnection((err) => {
            if (err) {
                console.log("Error connecting to db...")
            }
            console.log("Connected to db...")
        })
    }

    executeQuery = (query, params = []) => {
        return new Promise((resolve, reject) => {
            try {
                this.pool.query(query, params, (err, data) => {
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
