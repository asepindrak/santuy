declare const PriceFormat: Intl.NumberFormat;
import { DatabaseType } from '../types/type';
declare const parseDb: (provider: string, dbUrl: string) => DatabaseType;
declare const providerCheck: (dbUrl: string) => string;
export { PriceFormat, parseDb, providerCheck };
