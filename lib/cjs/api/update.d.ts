import { UpdateType } from '../types/type';
declare function update({ model, data, id }: UpdateType): Promise<unknown>;
export { update };
