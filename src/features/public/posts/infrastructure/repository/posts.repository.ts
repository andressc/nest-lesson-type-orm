import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from '../../entity/post.schema';
import { CreatePostExtendsDto } from '../../dto';
import { PostsRepositoryInterface } from '../../interfaces/posts.repository.interface';

@Injectable()
export class PostsRepository implements PostsRepositoryInterface {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<PostModel>,
	) {}

	async create(data: CreatePostExtendsDto): Promise<PostModel> {
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
	}
}
