import Database from '../config/database'
import { DatabaseType } from '../types/type'

async function paginate(database: DatabaseType, model: string, query: string, params: Array<string | number>, page: number = 1, limit: number = 10) {
    let skip = (page > 1) ? (page * limit) - limit : 0;
    const db = new Database(database)
    if (!query) {
        return false
    }
    let data = await db.executeQuery(`${query} LIMIT ${skip}, ${limit}`, params)
    let count: any = await db.executeQuery(`SELECT COUNT(*) as total FROM ${model}`, [])
    let result = {
        data,
        page,
        total: count[0].total
    }
    return result
}

export { paginate }