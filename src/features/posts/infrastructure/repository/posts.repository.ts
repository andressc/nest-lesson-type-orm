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

	/*async create(data: CreatePostExtendsDto): Promise<PostModel> {
		return new this.postModel(data);
	}

	async find(id: string): Promise<PostModel | null> {
		return this.postModel.findById(id);
	}

	async save(postModel: PostModel): Promise<PostModel> {
		return postModel.save();
	}

	async delete(postModel: PostModel): Promise<void> {
		await postModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.postModel.deleteMany();
	}*/
}
