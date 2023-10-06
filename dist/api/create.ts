import Database from '../config/database'
import { CreateType } from '../types/type'

async function create({ model, database, data }: CreateType) {
    const db = new Database(database)
    if (!data) {
        return false
    }
    const column = Object.keys(data)
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
        queryArr.push(data[col])
    }
    let result = await db.executeQuery(queryStr, queryArr)
    return result
}

export { create }