
import path from 'path'
import 'dotenv/config'
import fs from 'fs'
import { migrateData } from './migrate-data.mjs'
import parseDb from './parse-db-url.mjs'

const migrateCLI = async () => {
    console.log("DATABASE MIGRATION & SYNC\n")
    console.log(`--------------------------------------\n\n`)

    var dirname = path.dirname("santuy/models")
    if (!fs.existsSync(`${dirname}/schema.mjs`)) {
        //schema not exists
        console.error('Schema not exist\n\n')
        console.log("init santuy first\n\n")
        console.log("command:\n")
        console.log('npx santuy init')
        process.exit(0)
    }
    let SANTUY_ENV = process.env.SANTUY_ENV
    if (SANTUY_ENV == "development") {
        const { models } = await import(`../../santuy/schema.mjs`)
        migrateData(models)
    } else {
        const { models } = await import(`../../../../santuy/schema.mjs`)
        migrateData(models)
    }

}


export { migrateCLI }