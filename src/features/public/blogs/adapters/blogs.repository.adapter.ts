import { MainRepositoryAdapter } from './main.repository.adapter';

export abstract class BlogsRepositoryAdapter<MODEL, TYPE = string> extends MainRepositoryAdapter<
	MODEL,
	TYPE
> {
	/*abstract createBlogModel(data: CreateBlogExtendsDto): Promise<BlogModel>;
	abstract findBlogModel(id: string): Promise<BlogModel | null>;
	abstract save(blogModel: BlogModel): Promise<BlogModel>;
	abstract delete(blogModel: BlogModel): Promise<void>;
	abstract deleteAll(): Promise<void>;*/
}
