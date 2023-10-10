import { GetType, ResultType } from '../types/type';
declare function get({ model, paginate }: GetType): Promise<false | ResultType>;
export { get };
