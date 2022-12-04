import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../domain/blog.schema';
import { QueryBlogsRepositoryInterface } from '../../interfaces/query.blogs.repository.interface';
import { MainQueryRepository } from '../../../shared/infrastructure/query/main.query.repository';
import { Ban, BanModel } from '../../domain/ban.schema';
import { Sort } from '../../../../common/dto';

@Injectable()
export class QueryBlogsRepository
	extends MainQueryRepository<BlogModel>
	implements QueryBlogsRepositoryInterface
{
	constructor(
		@InjectModel(Blog.name) private readonly blogModel: Model<BlogModel>,
		@InjectModel(Ban.name) private readonly banModel: Model<BanModel>,
	) {
		super(blogModel);
	}

	async findBanModel(
		searchString: Record<string, unknown>,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<BanModel[] | null> {
		return this.banModel.find(searchString).sort(sortBy).skip(skip).limit(pageSize);
	}

	async countBan(searchString): Promise<number> {
		return this.banModel.countDocuments(searchString);
	}
}
