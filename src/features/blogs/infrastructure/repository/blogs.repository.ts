import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from '../../entity/blog.schema';
import { CreateBlogExtendsDto } from '../../dto';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { MainRepository } from '../../../shared/infrastructure/repository/main.repository';
import { Ban, BanModel } from '../../entity/ban.schema';
import { BanUnbanBlogOfUserExtendsDto } from '../../dto/ban-unban-blog-of-user-extends.dto';

@Injectable()
export class BlogsRepository
	extends MainRepository<BlogModel, CreateBlogExtendsDto>
	implements BlogsRepositoryInterface
{
	constructor(
		@InjectModel(Blog.name)
		private readonly blogModel: Model<BlogModel>,
		@InjectModel(Ban.name)
		private readonly banModel: Model<BanModel>,
	) {
		super(blogModel);
	}

	//Ban blog from user
	async findBanByBlogIdAndUserId(blogId: string, userId: string): Promise<BanModel | null> {
		return this.banModel.findOne({ blogId, userId });
	}

	async createBanModel(data: BanUnbanBlogOfUserExtendsDto): Promise<BanModel> {
		return new this.banModel(data);
	}

	async saveBanModel(model: BanModel): Promise<BanModel> {
		return model.save();
	}

	async deleteAllBan(): Promise<void> {
		await this.banModel.deleteMany();
	}
}
