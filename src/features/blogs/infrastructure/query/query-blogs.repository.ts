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
}
