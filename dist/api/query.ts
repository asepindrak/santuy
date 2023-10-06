import Database from '../config/database'
import { DatabaseType } from '../types/type'

async function query(database: DatabaseType, query: string, params: Array<string | number>) {
    const db = new Database(database)
    if (!query) {
        return false
    }
    let result = await db.executeQuery(query, params)
    return result
}

export { query }