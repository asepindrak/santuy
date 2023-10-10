import Database from "../config/database"

async function raw(query: string) {
    if (!query) {
        return false
    }
    const db = new Database()
    if (!query) {
        return false
    }
    let result = await db.executeQuery(query)
    if (!result) {
        return false
    }
    return result
}

export { raw }