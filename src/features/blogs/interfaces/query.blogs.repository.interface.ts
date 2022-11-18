import { BlogModel } from '../entity/blog.schema';
import { MainQueryRepositoryInterface } from '../../shared/interfaces/main.query.repository.interface';

/* eslint-disable */
export interface QueryBlogsRepositoryInterface
	extends MainQueryRepositoryInterface<BlogModel> {
}
