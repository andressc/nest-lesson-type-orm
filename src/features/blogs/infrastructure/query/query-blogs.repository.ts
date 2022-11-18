import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../entity/blog.schema';
import { QueryBlogsRepositoryInterface } from '../../interfaces/query.blogs.repository.interface';
import { MainQueryRepository } from '../../../shared/infrastructure/query/main.query.repository';

@Injectable()
export class QueryBlogsRepository
	extends MainQueryRepository<BlogModel>
	implements QueryBlogsRepositoryInterface
{
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {
		super(blogModel);
	}

	/*async find(id: ObjectId): Promise<BlogModel | null> {
		return this.blogModel.findById(id);
	}

	async findQuery(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<BlogModel[] | null> {
		return this.blogModel.find(searchString).sort(sortBy).skip(skip).limit(pageSize);
	}

	async count(searchString): Promise<number> {
		return this.blogModel.countDocuments(searchString);
	}*/
}
