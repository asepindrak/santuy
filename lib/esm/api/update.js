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
function update({ model, data, id }) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const db = new Database();
        if (!model || !id || !data) {
            return false;
        }
        const column = Object.keys(data);
        let queryStr = `UPDATE ${model.name} SET `;
        let index = 0;
        let col;
        try {
            for (var _d = true, column_1 = __asyncValues(column), column_1_1; column_1_1 = yield column_1.next(), _a = column_1_1.done, !_a; _d = true) {
                _c = column_1_1.value;
                _d = false;
                col = _c;
                if (index > 0 && index < column.length) {
                    queryStr += `, `;
                }
                if (col == "password") {
                    queryStr += `${col} = md5('${data[col]}') `;
                }
                else {
                    queryStr += `${col} = '${data[col]}' `;
                }
                index++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = column_1.return)) yield _b.call(column_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        queryStr += ` WHERE id=${id}`;
        let result = yield db.executeQuery(queryStr);
        return result;
    });
}
export { update };
