import Database from '../config/database'
import { GetType, ResultType } from '../types/type'

async function get({ model, database, paginate }: GetType) {
    const db = new Database(database)
    if (!model) {
        return false
    }
    let query = `SELECT * FROM ${model} where trash = 0 order by id desc`
    if (paginate) {
        let skip = (paginate.page > 1) ? (paginate.page * paginate.limit) - paginate.limit : 0
        query += ` LIMIT ${skip}, ${paginate.limit}`
    }

    let data: any = await db.executeQuery(query)
    if (!data) {
        return false
    }
    let count: any = await db.executeQuery(`SELECT COUNT(*) as total FROM ${model}`)
    let result: ResultType = {
        data,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? 0,
        total: count[0].total
    }
    return result
}

export { get }