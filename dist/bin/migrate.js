
import path from 'path'
import 'dotenv/config'
import fs from 'fs'
import { migrateData } from './migrate-data.js'
import parseDb from './parse-db-url.js'

const migrateCLI = async () => {
    console.log("DATABASE MIGRATION & SYNC\n")
    console.log(`--------------------------------------\n\n`)
    let dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
        console.error('No DATABASE_URL set\n\n')
        console.log("set DATABASE_URL in .env file\n\n")
        console.log("example:\n")
        console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"')
        process.exit(0)
    }
    let database = parseDb(dbUrl)

    var dirname = path.dirname("santuy/models")
    if (!fs.existsSync(`${dirname}/schema.js`)) {
        //schema not exists
        console.error('Schema not exist\n\n')
        console.log("init santuy first\n\n")
        console.log("command:\n")
        console.log('npx santuy init')
        process.exit(0)
    }
    let SANTUY_ENV = process.env.SANTUY_ENV
    if (SANTUY_ENV == "development") {
        const { models } = await import(`../../santuy/schema.js`)
        migrateData(database, models)
    } else {
        const { models } = await import(`../../../../santuy/schema.js`)
        migrateData(database, models)
    }

}


export { migrateCLI }