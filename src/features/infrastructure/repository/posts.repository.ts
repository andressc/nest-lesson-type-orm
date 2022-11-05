import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from '../../../database/entity/post.schema';
import { CreatePostExtendsDto } from '../../dto/posts';

@Injectable()
export class PostsRepository {
	constructor(@InjectModel(Post.name) private readonly postModel: Model<PostModel>) {}

	async createPost(data: CreatePostExtendsDto): Promise<PostModel> {
		return new this.postModel(data);
	}

	async findPostModel(id: string): Promise<PostModel | null> {
		return this.postModel.findById(id);
	}

	async deleteAll(): Promise<void> {
		await this.postModel.deleteMany();
	}
}
