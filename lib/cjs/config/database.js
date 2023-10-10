"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("mysql2");
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
require("dotenv/config");
const util_1 = require("..//utils/util");
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
        let provider = (0, util_1.providerCheck)(dbUrl !== null && dbUrl !== void 0 ? dbUrl : "");
        let database = (0, util_1.parseDb)(provider, dbUrl !== null && dbUrl !== void 0 ? dbUrl : "mysql://root:@localhost:3306/santuy");
        this.host = database.host;
        this.user = database.user;
        this.password = database.password;
        this.port = database.port;
        this.database = database.database;
        this.provider = provider;
        if (provider == "mysql") {
            this.pool = (0, mysql2_1.createPool)({
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
exports.default = Database;
