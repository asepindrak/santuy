import Database from '../config/database'
import { RemoveType } from '../types/type'

async function remove({ model, database, id }: RemoveType) {
    const db = new Database(database)
    if (!id) {
        return false
    }
    let result = await db.executeQuery(`UPDATE ${model} SET trash = 1 WHERE id = ${id}`)
    if (!result) {
        return false
    }
    return result
}

export { remove }