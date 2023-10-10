
import path from 'path'
import 'dotenv/config'
import fs from 'fs'
import { migrateDataMysql } from './migrate-data-mysql.mjs'
import { migrateDataPg } from './migrate-data-postgresql.mjs'
import providerCheck from './provider-check.mjs'

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
    let dbUrl = process.env.DATABASE_URL
    let provider = providerCheck(dbUrl)

    if (SANTUY_ENV == "development") {
        const { models } = await import(`../../santuy/schema.mjs`)
        if (provider == "mysql") {
            migrateDataMysql(models)
        } else if (provider == "postgresql") {
            migrateDataPg(models)
        } else {
            console.error('SQL provider error\n\n')
            console.log("env file:\n")
            console.log('provider: postgresql / mysql')
            process.exit(0)
        }
    } else {
        const { models } = await import(`../../../../santuy/schema.mjs`)
        if (provider == "mysql") {
            migrateDataMysql(models)
        } else if (provider == "postgresql") {
            migrateDataPg(models)
        } else {
            console.error('SQL provider error\n\n')
            console.log("env file:\n")
            console.log('provider: postgresql / mysql')
            process.exit(0)
        }
    }

}

export { migrateCLI }