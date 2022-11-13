import { BlogModel } from '../entity/blog.schema';
import { CreateBlogExtendsDto } from '../dto';

export abstract class BlogsRepositoryAdapter {
	abstract createBlogModel(data: CreateBlogExtendsDto): Promise<BlogModel>;
	abstract findBlogModel(id: string): Promise<BlogModel | null>;
	abstract save(blogModel: BlogModel): Promise<BlogModel>;
	abstract delete(blogModel: BlogModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
