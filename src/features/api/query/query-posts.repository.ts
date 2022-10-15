import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueryPostDto } from '../../dto/posts/query-post.dto';
import { Post, PostModel } from '../../../entity/post.schema';
import { PostNotFoundException } from '../../../common/exceptions/PostNotFoundException';

@Injectable()
export class QueryPostsRepository {
	constructor(@InjectModel(Post.name) private readonly postModel: Model<PostModel>) {}

	async findAllPosts(): Promise<QueryPostDto[]> {
		const post: PostModel[] = await this.postModel.find();
		return this.mapPosts(post);
	}

	async findOnePost(id: string): Promise<QueryPostDto> {
		const post: PostModel | null = await this.postModel.findById(id);
		if (!post) throw new PostNotFoundException(id);

		return {
			id: post.id.toString(),
			title: post.title,
			shortDescription: post.shortDescription,
			content: post.content,
			blogId: post.blogId,
			blogName: post.blogName,
			createdAt: post.createdAt,
		};
	}

	private mapPosts(post: PostModel[]) {
		return post.map((v: PostModel) => ({
			id: v._id.toString(),
			title: v.title,
			shortDescription: v.shortDescription,
			content: v.content,
			blogId: v.blogId,
			blogName: v.blogName,
			createdAt: v.createdAt,
		}));
	}
}
