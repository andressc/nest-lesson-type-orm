import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class QueryDto {
	@Type(() => Number)
	//@IsNumber()
	pageNumber?: number;

	@Type(() => Number)
	//@IsNumber()
	pageSize?: number;

	sortBy?: string;
	sortDirection?: string;
}
