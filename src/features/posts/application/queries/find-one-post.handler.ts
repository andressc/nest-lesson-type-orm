import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostNotFoundException } from '../../../../common/exceptions';
import { ResponsePostDto } from '../../dto';
import { PostModel } from '../../domain/post.schema';
import { QueryPostsRepositoryInterface } from '../../interfaces/query.posts.repository.interface';
import { ObjectId } from 'mongodb';
import { QueryBlogsRepositoryInterface } from '../../../blogs/interfaces/query.blogs.repository.interface';
import { InjectQueryBlogsRepository } from '../../../blogs/infrastructure/providers/query-blogs-repository.provider';
import { InjectQueryPostsRepository } from '../../infrastructure/providers/query-posts-repository.provider';

export class FindOnePostCommand {
	constructor(public id: string, public currentUserId: string | null) {}
}

@QueryHandler(FindOnePostCommand)
export class FindOnePostHandler implements IQueryHandler<FindOnePostCommand> {
	constructor(
		@InjectQueryPostsRepository()
		private readonly queryPostsRepository: QueryPostsRepositoryInterface,
		@InjectQueryBlogsRepository()
		private readonly queryBlogsRepository: QueryBlogsRepositoryInterface,
	) {}

	async execute(command: FindOnePostCommand): Promise<ResponsePostDto | null> {
		const post: PostModel | null = await this.queryPostsRepository.find(new ObjectId(command.id));
		if (!post) throw new PostNotFoundException(command.id);

		const extendedLikesInfo = this.queryPostsRepository.countLikes(post, command.currentUserId);

		return {
			id: post._id.toString(),
			title: post.title,
			shortDescription: post.shortDescription,
			content: post.content,
			blogId: post.blogId,
			blogName: post.blogName,
			createdAt: post.createdAt,
			extendedLikesInfo,
		};
	}
}
