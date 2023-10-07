import Database from '../config/database.js'
import { RestoreType } from '../types/type'

async function restore({ model, database, id }: RestoreType) {
    const db = new Database(database)
    if (!id || !model) {
        return false
    }
    let result = await db.executeQuery(`UPDATE ${model.name} SET trash = 0 WHERE id = ${id}`)
    if (!result) {
        return false
    }
    return result
}

export { restore }