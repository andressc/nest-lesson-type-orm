import { Injectable } from '@nestjs/common';
import { PaginationCalc, QueryPaginationDto, Sort } from '../dto/general/pagination.dto';

@Injectable()
export class PaginationService {
	pagination(query: QueryPaginationDto): PaginationCalc {
		const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

		const sortBy: Sort = query.sortBy
			? { [query.sortBy]: sortDirection }
			: { createdAt: sortDirection };

		if (!query.pageNumber || query.pageNumber === 0) {
			query.pageNumber = 1;
		}

		if (!query.pageSize || query.pageSize === 0) {
			query.pageSize = 10;
		}

		const skip = (query.pageNumber - 1) * query.pageSize;
		const pagesCount = Math.ceil(query.totalCount / query.pageSize);

		return {
			pagesCount,
			pageNumber: query.pageNumber,
			pageSize: query.pageSize,
			skip,
			sortBy,
		};
	}
}
