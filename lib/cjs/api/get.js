"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const database_1 = __importDefault(require("../config/database"));
function get({ model, paginate }) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const db = new database_1.default();
        if (!model) {
            return false;
        }
        let query = `SELECT * FROM ${model.name} where trash = 0 order by id desc`;
        if (paginate) {
            let skip = (paginate.page > 1) ? (paginate.page * paginate.limit) - paginate.limit : 0;
            if (db.provider == "mysql") {
                query += ` LIMIT ${skip}, ${paginate.limit}`;
            }
            else if (db.provider == "postgresql") {
                query += ` LIMIT ${skip} OFFSET ${paginate.limit}`;
            }
        }
        let data = yield db.executeQuery(query);
        if (db.provider == "postgresql") {
            data = data.rows;
        }
        if (!data.length) {
            return false;
        }
        let count = yield db.executeQuery(`SELECT COUNT(id) as total FROM ${model.name}`);
        if (db.provider == "postgresql") {
            count = count.rows;
        }
        if (!count[0].total) {
            return false;
        }
        let result = {
            data,
            page: (_a = paginate === null || paginate === void 0 ? void 0 : paginate.page) !== null && _a !== void 0 ? _a : 1,
            limit: (_b = paginate === null || paginate === void 0 ? void 0 : paginate.limit) !== null && _b !== void 0 ? _b : 0,
            total: count[0].total
        };
        return result;
    });
}
exports.get = get;
