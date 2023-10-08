import Database from './database.js'
import { promises as fs } from 'fs'

async function seed(database, model) {
    const db = new Database(database)
    if (!model || !path) {
        return false
    }

    await db.executeQuery("START TRANSACTION")

    const json = await fs.readFile(`${path}/${model.name}.json`, 'utf8')

    let item
    for await (item of JSON.parse(json)) {
        const column = Object.keys(item)
        let queryStr = `INSERT INTO ${model.name} SET `
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

    return true
}

export { seed }