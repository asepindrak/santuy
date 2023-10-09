import Database from './database.mjs'
import { promises as fs } from 'fs'
import path from 'path'

async function seedData(seed) {
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
            let queryStr = `INSERT INTO ${seed} SET `
            let queryArr = []
            let index = 0
            let col
            for await (col of column) {
                if (index > 0 && index < column.length) {
                    queryStr += `, `
                }
                if (col == "password") {
                    queryStr += `${col} = md5(?) `
                } else {
                    queryStr += `${col} = ? `
                }
                index++
                queryArr.push(item[col])
            }
            await db.executeQuery(queryStr, queryArr)
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