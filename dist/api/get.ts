import Database from '@santuyapi/config/database'
import { GetType, ResultType } from '@santuyapi/types/type'

async function get({ model, paginate }: GetType) {
    const db = new Database()
    if (!model) {
        return false
    }
    let query = `SELECT * FROM ${model.name} where trash = 0 order by id desc`
    if (paginate) {
        let skip = (paginate.page > 1) ? (paginate.page * paginate.limit) - paginate.limit : 0
        query += ` LIMIT ${skip}, ${paginate.limit}`
    }

    let data: any = await db.executeQuery(query)
    if (!data) {
        return false
    }
    let count: any = await db.executeQuery(`SELECT COUNT(*) as total FROM ${model.name}`)
    let result: ResultType = {
        data,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? 0,
        total: count[0].total
    }
    return result
}

export { get }