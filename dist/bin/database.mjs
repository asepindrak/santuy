import { createPool } from "mysql2"

class Database {
    host
    user
    password
    port
    database
    pool
    constructor({ host, user, password, port, database }) {
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
