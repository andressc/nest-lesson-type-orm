import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from '../../../entity/post.schema';
import { UpdatePostExtendsDto, CreatePostExtendsDto } from '../../dto/posts';
import { CreateLikeDto } from '../../dto/comments';

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

	async setLike(
		post: PostModel,
		data: CreateLikeDto,
		authUserId: string,
		userLogin: string,
	): Promise<void> {
		const updatePost = await post.setLike(data, authUserId, userLogin);
		await updatePost.save();
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
