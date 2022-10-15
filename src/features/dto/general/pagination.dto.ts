import { QueryDto } from './query.dto';
import { SortOrder } from 'mongoose';

export type Sort =
	| string
	| { [key: string]: SortOrder | { $meta: 'textScore' } }
	| [string, SortOrder][];

export class PaginationDto<T> {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: T;
}

export class PaginationCalc {
	pagesCount: number;
	pageNumber: number;
	pageSize: number;
	skip: number;
	sortBy: Sort;
}

export class QueryPaginationDto extends QueryDto {
	totalCount: number;
}
