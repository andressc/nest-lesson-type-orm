import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../infrastructure/repository';
import { PostModel } from '../../../database/entity';
import { PostNotFoundException } from '../../../common/exceptions';

@Injectable()
export class PostsService {
	constructor(private readonly postsRepository: PostsRepository) {}

	public async findPostOrErrorThrow(id: string): Promise<PostModel> {
		const post: PostModel | null = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}
}
