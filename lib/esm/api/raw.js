var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from "../config/database";
function raw(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!query) {
            return false;
        }
        const db = new Database();
        if (!query) {
            return false;
        }
        let result = yield db.executeQuery(query);
        if (!result) {
            return false;
        }
        if (result.rows) {
            if (db.provider == "postgresql") {
                result = result.rows;
            }
        }
        return result;
    });
}
export { raw };
