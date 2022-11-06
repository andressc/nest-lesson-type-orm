import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from '../../../database/entity';
import { CreatePostExtendsDto } from '../../dto/posts';
import { PostsRepositoryInterface } from './interfaces';

@Injectable()
export class PostsRepository implements PostsRepositoryInterface {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<PostModel>,
	) {}

	async createPostModel(data: CreatePostExtendsDto): Promise<PostModel> {
		return new this.postModel(data);
	}

	async findPostModel(id: string): Promise<PostModel | null> {
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
	}
}
