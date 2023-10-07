import Database from '../config/database.js'
import { DetailType, GetType, ResultType } from '../types/type'

async function detail({ model, database, id }: DetailType) {
    const db = new Database(database)
    if (!model || !id) {
        return false
    }
    let query = `SELECT * FROM ${model.name} where trash = 0 and id = ? limit 1`

    let result: any = await db.executeQuery(query, [id])
    if (!result) {
        return false
    }
    return result
}

export { detail }