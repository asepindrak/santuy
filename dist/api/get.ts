import Database from "../config/database"
import { GetType, ResultType } from '../types/type'

async function get({ model, paginate }: GetType) {
    const db = new Database()
    if (!model) {
        return false
    }
    let query = `SELECT * FROM ${model.name} where trash = 0 order by id desc`
    if (paginate) {
        let skip = (paginate.page > 1) ? (paginate.page * paginate.limit) - paginate.limit : 0
        if (db.provider == "mysql") {
            query += ` LIMIT ${skip}, ${paginate.limit}`
        } else if (db.provider == "postgresql") {
            query += ` LIMIT ${skip} OFFSET ${paginate.limit}`
        }

    }

    let data: any = await db.executeQuery(query)
    if (db.provider == "postgresql") {
        data = data.rows
    }
    if (!data.length) {
        return false
    }
    let count: any = await db.executeQuery(`SELECT COUNT(id) as total FROM ${model.name}`)
    if (db.provider == "postgresql") {
        count = count.rows
    }
    if (!count[0].total) {
        return false
    }
    let result: ResultType = {
        data,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? 0,
        total: count[0].total
    }
    return result
}

export { get }