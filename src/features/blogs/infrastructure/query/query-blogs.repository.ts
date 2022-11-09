import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Sort } from '../../../../common/dto';
import { Blog, BlogModel } from '../../entity/blog.schema';

@Injectable()
export class QueryBlogsRepository {
	constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>) {}

	async findBlogModel(id: string): Promise<BlogModel | null> {
		return this.blogModel.findById(id);
	}

	async findBlogQueryModel(
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
