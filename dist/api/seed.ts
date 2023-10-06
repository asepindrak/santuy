import Database from '../config/database'
import { promises as fs } from 'fs';
import { SeedType } from '../types/type'

async function seed({ model, path, database }: SeedType) {
    const db = new Database(database)
    await db.executeQuery("START TRANSACTION",
        []
    )

    const json = await fs.readFile(`${path}/${model}.json`, 'utf8');

    // console.log(json)
    let item: any
    for await (item of JSON.parse(json)) {
        const column = Object.keys(item)
        let queryStr = `INSERT INTO ${model} SET `
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