import { createPool } from "mysql2";
import pg from "pg";
const { Pool } = pg;
import 'dotenv/config';
import { parseDb, providerCheck } from "..//utils/util";
class Database {
    constructor() {
        this.executeQuery = (query) => {
            return new Promise((resolve, reject) => {
                try {
                    this.pool.query(query, [], (err, data) => {
                        if (err) {
                            console.log('ROLLBACK', err);
                            this.pool.query("ROLLBACK");
                            reject(err);
                            throw err;
                        }
                        resolve(data);
                    });
                }
                catch (error) {
                }
            });
        };
        let dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            console.error('No DATABASE_URL set\n\n');
            console.log("set DATABASE_URL in .env file\n\n");
            console.log("example:\n");
            console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"');
        }
        let provider = providerCheck(dbUrl !== null && dbUrl !== void 0 ? dbUrl : "");
        let database = parseDb(provider, dbUrl !== null && dbUrl !== void 0 ? dbUrl : "mysql://root:@localhost:3306/santuy");
        this.host = database.host;
        this.user = database.user;
        this.password = database.password;
        this.port = database.port;
        this.database = database.database;
        this.provider = provider;
        if (provider == "mysql") {
            this.pool = createPool({
                host: this.host,
                user: this.user,
                password: this.password,
                port: this.port,
                database: this.database,
            });
            this.pool.getConnection((err) => {
                if (err) {
                    console.log("Error connecting to db...");
                }
                console.log("Connected to db...");
            });
        }
        else if (provider == "postgresql") {
            this.pool = new Pool({
                host: this.host,
                user: this.user,
                password: this.password,
                port: this.port,
                database: this.database,
            });
        }
    }
}
export default Database;
