import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from '../../../entity/post.schema';
import { UpdatePostExtendsDto } from '../../dto/posts/update-post-extends.dto';
import { CreatePostExtendsDto } from '../../dto/posts/create-post-extends.dto';

@Injectable()
export class PostsRepository {
	constructor(@InjectModel(Post.name) private readonly postModel: Model<PostModel>) {}

	async createPost(data: CreatePostExtendsDto): Promise<string> {
		const newPost: PostModel = new this.postModel(data);

		const result = await newPost.save();
		return result.id.toString();
	}

	async updatePost(post: PostModel, data: UpdatePostExtendsDto): Promise<void> {
		await post.updateData(data).save();
	}

	async removePost(post: PostModel): Promise<void> {
		await post.delete();
	}

	async findPostModel(id: string): Promise<PostModel | null> {
		return this.postModel.findById(id);
	}

	async deleteAll(): Promise<void> {
		await this.postModel.deleteMany();
	}
}
