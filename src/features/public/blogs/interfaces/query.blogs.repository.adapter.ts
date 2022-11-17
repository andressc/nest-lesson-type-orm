import { BlogModel } from '../entity/blog.schema';
import { Sort } from '../../../../common/dto';

export abstract class QueryBlogsRepositoryAdapter {
	abstract findBlogModel(id: string): Promise<BlogModel | null>;
	abstract findBlogQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<BlogModel[] | null>;
	abstract count(searchString): Promise<number>;
}
