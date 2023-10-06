import Database from '../config/database'
import { DatabaseType, PaginateType } from '../types/type'

async function query(database: DatabaseType, query: string, params: Array<string | number>, paginate?: PaginateType | null) {
    const db = new Database(database)
    if (!query) {
        return false
    }
    if (paginate) {
        let skip = (paginate.page > 1) ? (paginate.page * paginate.limit) - paginate.limit : 0
        query += ` LIMIT ${skip}, ${paginate.limit}`
    }
    let data = await db.executeQuery(query, params)
    if (!data) {
        return false
    }
    let count: any = [{
        total: 0
    }]
    if (paginate?.model) {
        count = await db.executeQuery(`SELECT COUNT(*) as total FROM ${paginate?.model}`, [])
    }
    let result = {
        data,
        page: paginate?.page || 1,
        total: count[0].total
    }
    return result
}

export { query }