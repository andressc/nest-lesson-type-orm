import { MainRepositoryInterface } from '../../shared/interfaces/main.repository.interface';
import { BlogModel } from '../entity/blog.schema';
import { CreateBlogExtendsDto } from '../dto';

/* eslint-disable */
export interface BlogsRepositoryInterface
	extends MainRepositoryInterface<BlogModel, CreateBlogExtendsDto> {
}
