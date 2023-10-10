import Database from "../config/database"

async function raw(query: string) {
    if (!query) {
        return false
    }
    const db = new Database()
    if (!query) {
        return false
    }
    let result: any = await db.executeQuery(query)
    if (!result) {
        return false
    }
    if (result.rows) {
        if (db.provider == "postgresql") {
            result = result.rows
        }
    }
    return result
}

export { raw }