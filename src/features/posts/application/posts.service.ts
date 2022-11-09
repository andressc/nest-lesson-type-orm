import { Injectable } from '@nestjs/common';
import { PostModel } from '../entity/post.schema';
import { PostNotFoundException } from '../../../common/exceptions';
import { PostsRepository } from '../infrastructure/repository/posts.repository';

@Injectable()
export class PostsService {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async findPostOrErrorThrow(id: string): Promise<PostModel> {
		const post: PostModel | null = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}
}
