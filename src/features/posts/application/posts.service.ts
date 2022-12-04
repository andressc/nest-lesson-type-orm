import { Injectable } from '@nestjs/common';
import { PostModel } from '../domain/post.schema';
import { PostNotFoundException } from '../../../common/exceptions';
import { PostsRepositoryInterface } from '../interfaces/posts.repository.interface';
import { InjectPostsRepository } from '../infrastructure/providers/posts-repository.provider';

@Injectable()
export class PostsService {
	constructor(
		@InjectPostsRepository() private readonly postsRepository: PostsRepositoryInterface,
	) {}

	public async findPostOrErrorThrow(id: string): Promise<PostModel> {
		const post: PostModel | null = await this.postsRepository.find(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}
}
