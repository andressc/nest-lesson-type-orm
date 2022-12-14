import { Sort } from '../../../common/dto';
import { ObjectId } from 'mongodb';

export interface MainQueryRepositoryInterface<MODEL> {
	find(id: ObjectId): Promise<MODEL | null>;
	findQuery(
		searchString: Record<string, unknown>,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<MODEL[] | null>;
	count(searchString): Promise<number>;
}
