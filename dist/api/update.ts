import Database from '../config/database'
import { UpdateType } from '../types/type'

async function update({ model, data, id }: UpdateType) {
    const db = new Database()
    if (!model || !id || !data) {
        return false
    }
    const column = Object.keys(data)
    let queryStr = `UPDATE ${model.name} SET `
    let queryArr: any = []
    let index = 0
    let col: any
    for await (col of column) {
        if (index > 0 && index < column.length) {
            queryStr += `, `
        }
        if (col == "password") {
            queryStr += `${col} = md5(?) `
        } else {
            queryStr += `${col} = ? `
        }
        index++
        queryArr.push(data[col])
    }
    queryStr += ` WHERE id=?`
    queryArr.push(id)
    let result = await db.executeQuery(queryStr, queryArr)
    return result
}

export { update }