import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { seedData } from './seed-data.mjs'
import parseDb from './parse-db-url.mjs'



async function seedCLI(args) {
    if (args[1]) {
        console.log("DATABASE SEEDER\n")
        console.log(`--------------------------------------\n\n`)
        console.log(`Seeding ${args[1]}\n`)
        let seed = args[1]
        var dirname = path.dirname("santuy/seeds")
        if (!fs.existsSync(`${dirname}/seeds/${seed}.json`)) {
            console.error(`error: Seed ${seed}.json not exists!\n`)
            console.log(`command for generate seed:\n`)
            console.log(`npx santuy generate seed ${seed}`)
            process.exit(0)
        }
        let dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            console.error('No DATABASE_URL set\n\n')
            console.log("set DATABASE_URL in .env file\n\n")
            console.log("example:\n")
            console.log('DATABASE_URL="mysql://root:@localhost:3306/santuy"')
            process.exit(0)
        }
        let database = parseDb(dbUrl)
        seedData(database, seed)
    } else {
        help()
    }

}

export { seedCLI }