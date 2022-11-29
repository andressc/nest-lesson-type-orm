import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from '../../entity/post.schema';
import { CreatePostExtendsDto } from '../../dto';
import { PostsRepositoryInterface } from '../../interfaces/posts.repository.interface';
import { MainRepository } from '../../../shared/infrastructure/repository/main.repository';

@Injectable()
export class PostsRepository
	extends MainRepository<PostModel, CreatePostExtendsDto>
	implements PostsRepositoryInterface
{
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<PostModel>,
	) {
		super(postModel);
	}

	async setBan(blogId: string, isBanned: boolean): Promise<void> {
		await this.postModel.updateMany({ blogId }, { isBanned });
	}
}
