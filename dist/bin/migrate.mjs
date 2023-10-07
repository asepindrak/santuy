
import path from 'path'
import 'dotenv/config'
import fs from 'fs'
import { migrateData } from './migrate-data.mjs'

const migrateCLI = async () => {
    console.log("MIGRATION\n")
    console.log(`--------------------------------------\n\n`)
    let dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
        console.error('No DATABASE URL set\n\n')
        console.log("set DATABASE_URL in .env file\n\n")
        console.log("example:\n")
        console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"')
        process.exit(0)
    }
    dbUrl = dbUrl.replace("mysql://", "")
    dbUrl = dbUrl.replace("@", ":")
    let dbArr = dbUrl.split(":")
    let user = dbArr[0]
    let password = dbArr[1]
    let host = dbArr[2]
    let portdb = dbArr[3]
    let portdbArr = portdb.split("/")
    let port = parseInt(portdbArr[0]);
    let database = portdbArr[1];

    let db = {
        user,
        password,
        host,
        port,
        database
    }
    var dirname = path.dirname("santuy/models");
    if (!fs.existsSync(`${dirname}/schema.mjs`)) {
        //schema not exists
        console.error('Schema not exist\n\n')
        console.log("init santuy first\n\n")
        console.log("example:\n")
        console.log('npx santuy init')
        process.exit(0)
    }
    const { models } = await import(`../../santuy/schema.mjs`);
    migrateData(db, models)
}


export { migrateCLI }