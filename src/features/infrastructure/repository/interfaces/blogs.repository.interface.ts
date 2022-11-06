import { CreateBlogExtendsDto } from '../../../dto/blogs';
import { BlogModel } from '../../../../database/entity';

export abstract class BlogsRepositoryInterface {
	abstract createBlogModel(data: CreateBlogExtendsDto): Promise<BlogModel>;
	abstract findBlogModel(id: string): Promise<BlogModel | null>;
	abstract save(blogModel: BlogModel): Promise<BlogModel>;
	abstract delete(blogModel: BlogModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
