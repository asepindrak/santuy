import Database from '../config/database'
import { GetType } from '../types/type'

async function get({ request, model, database }: GetType) {
    const db = new Database(database)
    if (!model) {
        return request.json("error: model not define", { status: 400 })
    }
    await db.executeQuery("START TRANSACTION",
        []
    )
    let response = await db.executeQuery(`SELECT * FROM ${model} where trash = 0 order by id desc`,
        []
    )
    await db.executeQuery("COMMIT",
        []
    )
    return request.json(response, { status: 200 })
}

export { get }