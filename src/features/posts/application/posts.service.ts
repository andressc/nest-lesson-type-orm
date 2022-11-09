import { Injectable } from '@nestjs/common';
import { PostModel } from '../entity/post.schema';
import { PostNotFoundException } from '../../../common/exceptions';
import { PostsRepositoryInterface } from '../interface/posts.repository.interface';

@Injectable()
export class PostsService {
	constructor(private readonly postsRepository: PostsRepositoryInterface) {}

	public async findPostOrErrorThrow(id: string): Promise<PostModel> {
		const post: PostModel | null = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}
}
