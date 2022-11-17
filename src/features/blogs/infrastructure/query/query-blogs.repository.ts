import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Sort } from '../../../../common/dto';
import { Blog, BlogModel } from '../../entity/blog.schema';
import { QueryBlogsRepositoryInterface } from '../../interfaces/query.blogs.repository.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class QueryBlogsRepository implements QueryBlogsRepositoryInterface {
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {}

	async find(id: ObjectId): Promise<BlogModel | null> {
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
	}
}
