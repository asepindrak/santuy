var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import Database from "../config/database";
function create({ model, data }) {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const db = new Database();
        if (!data || !model) {
            return false;
        }
        const column = Object.keys(data);
        let queryStr = `INSERT INTO ${model.name} ( `;
        let index = 0;
        let col;
        try {
            for (var _g = true, column_1 = __asyncValues(column), column_1_1; column_1_1 = yield column_1.next(), _a = column_1_1.done, !_a; _g = true) {
                _c = column_1_1.value;
                _g = false;
                col = _c;
                col = col.toLowerCase();
                if (index > 0 && index < column.length) {
                    queryStr += `, `;
                }
                if (col == "password") {
                    queryStr += `${col} `;
                }
                else {
                    queryStr += `${col} `;
                }
                index++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = column_1.return)) yield _b.call(column_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        queryStr += ` ) `;
        queryStr += ` VALUES ( `;
        let indexValue = 0;
        let colValue;
        try {
            for (var _h = true, column_2 = __asyncValues(column), column_2_1; column_2_1 = yield column_2.next(), _d = column_2_1.done, !_d; _h = true) {
                _f = column_2_1.value;
                _h = false;
                colValue = _f;
                colValue = colValue.toLowerCase();
                if (indexValue > 0 && indexValue < column.length) {
                    queryStr += `, `;
                }
                if (colValue == "password") {
                    queryStr += `md5('${data[colValue]}')`;
                }
                else {
                    queryStr += `'${data[colValue]}'`;
                }
                indexValue++;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_h && !_d && (_e = column_2.return)) yield _e.call(column_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        queryStr += ` ) `;
        let result = yield db.executeQuery(queryStr);
        return result;
    });
}
export { create };
