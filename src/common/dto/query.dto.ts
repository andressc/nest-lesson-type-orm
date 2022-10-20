import { Type } from 'class-transformer';

export class QueryDto {
	@Type(() => Number)
	pageNumber?: number;

	@Type(() => Number)
	pageSize?: number;

	sortBy?: string;
	sortDirection?: string;
}
