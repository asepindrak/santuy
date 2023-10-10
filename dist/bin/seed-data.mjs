import Database from './database.mjs'
import { promises as fs } from 'fs'
import path from 'path'

async function seedData(seed) {
    seed = seed.toLowerCase()
    const db = new Database()
    if (!seed || !db) {
        console.error(`error: Seeding ${args[1]} failed!\n`)
        process.exit(0)
    }

    await db.executeQuery("START TRANSACTION")
    var dirname = path.dirname("santuy/seeds")
    const json = await fs.readFile(`${dirname}/seeds/${seed}.json`, 'utf8')
    if (json) {
        let item
        for await (item of JSON.parse(json)) {
            const column = Object.keys(item)
            let queryStr = `INSERT INTO ${seed} ( `
            let index = 0
            let col
            for await (col of column) {
                col = col.toLowerCase()
                if (index > 0 && index < column.length) {
                    queryStr += `, `
                }
                if (col == "password") {
                    queryStr += `${col} `
                } else {
                    queryStr += `${col} `
                }
                index++
            }
            queryStr += ` ) `
            queryStr += ` VALUES ( `
            let indexValue = 0
            let colValue
            for await (colValue of column) {
                colValue = colValue.toLowerCase()
                if (indexValue > 0 && indexValue < column.length) {
                    queryStr += `, `
                }
                if (col == "password") {
                    queryStr += `md5('${item[col]}')`
                } else {
                    queryStr += `'${item[col]}'`
                }
                indexValue++
            }
            queryStr += ` ) `
            console.log(queryStr)
            await db.executeQuery(queryStr)
        }

        await db.executeQuery("COMMIT")


        console.log(`Seeding ${seed} has been successfully!\n`)
        process.exit(0)
    } else {
        console.error(`error: Seeding ${seed} failed!\n`)
        process.exit(0)
    }

}

export { seedData }