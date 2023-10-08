import Database from '@santuyapi/config/database'
import { RawType } from '@santuyapi/types/type'

async function raw({ query, params = [] }: RawType) {
    if (!query) {
        return false
    }
    const db = new Database()
    if (!query) {
        return false
    }
    let result = await db.executeQuery(query, params)
    if (!result) {
        return false
    }
    return result
}

export { raw }