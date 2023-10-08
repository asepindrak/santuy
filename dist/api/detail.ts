import Database from '@santuyapi/config/database'
import { DetailType } from '@santuyapi/types/type'

async function detail({ model, id }: DetailType) {
    const db = new Database()
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