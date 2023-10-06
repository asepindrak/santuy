import Database from '../config/database'
import { GetType } from '../types/type'

async function get({ response, model, database }: GetType) {
    const db = new Database(database)
    if (!model) {
        return response.json("error: model not define", { status: 400 })
    }
    await db.executeQuery("START TRANSACTION",
        []
    )
    let result = await db.executeQuery(`SELECT * FROM ${model} where trash = 0 order by id desc`,
        []
    )
    await db.executeQuery("COMMIT",
        []
    )
    return response.json(result, { status: 200 })
}

export { get }