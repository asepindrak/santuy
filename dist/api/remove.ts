import Database from '../config/database.js'
import { RemoveType } from '../types/type'

async function remove({ model, database, id }: RemoveType) {
    const db = new Database(database)
    if (!id || !model) {
        return false
    }
    let result = await db.executeQuery(`UPDATE ${model.name} SET trash = 1 WHERE id = ${id}`)
    if (!result) {
        return false
    }
    return result
}

export { remove }