import Database from "../config/database"
import { CreateType } from '../types/type'

async function create({ model, data }: CreateType) {
    const db = new Database()
    if (!data || !model) {
        return false
    }
    const column = Object.keys(data)
    let queryStr = `INSERT INTO ${model.name} ( `
    let index = 0
    let col: any
    for await (col of column) {
        col = col.toLowerCase()
        if (index > 0 && index < column.length) {
            queryStr += `, `
        }
        if (col == "password") {
            queryStr += `${col} `
        } else {
            queryStr += `${col} `
        }
        index++
    }
    queryStr += ` ) `
    queryStr += ` VALUES ( `
    let indexValue = 0
    let colValue: any
    for await (colValue of column) {
        colValue = colValue.toLowerCase()
        if (indexValue > 0 && indexValue < column.length) {
            queryStr += `, `
        }
        if (colValue == "password") {
            queryStr += `md5('${data[colValue]}')`
        } else {
            queryStr += `'${data[colValue]}'`
        }
        indexValue++
    }
    queryStr += ` ) `
    let result = await db.executeQuery(queryStr)
    return result
}

export { create }