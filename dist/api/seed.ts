import Database from '../config/database'
import fs from 'fs-extra'
import { SeedType } from '../types/type'

async function seed({ seed, path, database }: SeedType) {
    const db = new Database(database)
    await db.executeQuery("START TRANSACTION",
        []
    )

    const json = await fs.readJsonSync(`${path}/${seed}.json`)

    // console.log(json)
    let item: any
    for await (item of JSON.parse(json)) {
        const column = Object.keys(item)
        let queryStr = `INSERT INTO ${seed} SET `
        let queryArr: any = []
        let index = 0
        let col: any
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

    await db.executeQuery("COMMIT",
        []
    )

    return true
}

export { seed }