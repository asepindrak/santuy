import Database from "../config/database"
import { DetailType } from '../types/type'

async function detail({ model, id }: DetailType) {
    const db = new Database()
    if (!model || !id) {
        return false
    }
    let query = `SELECT * FROM ${model.name} where trash = 0 and id = ${id} limit 1`

    let result: any = await db.executeQuery(query)
    if (db.provider == "postgresql") {
        result = result.rows
    }
    if (!result.length) {
        return false
    }
    return result
}

export { detail }