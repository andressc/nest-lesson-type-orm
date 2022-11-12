import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostNotFoundException } from '../../../../common/exceptions';
import { ResponsePostDto } from '../../dto';
import { PostModel } from '../../entity/post.schema';
import { QueryPostsRepositoryInterface } from '../../interface/query.posts.repository.interface';

export class FindOnePostCommand {
	constructor(public id: string, public currentUserId: string | null) {}
}

@QueryHandler(FindOnePostCommand)
export class FindOnePostHandler implements IQueryHandler<FindOnePostCommand> {
	constructor(private readonly queryPostsRepository: QueryPostsRepositoryInterface) {}

	async execute(command: FindOnePostCommand): Promise<ResponsePostDto> {
		const post: PostModel | null = await this.queryPostsRepository.findPostModel(command.id);
		if (!post) throw new PostNotFoundException(command.id);

		const likesInfo = this.queryPostsRepository.countLikes(post, command.currentUserId);

		return {
			id: post.id.toString(),
			title: post.title,
			shortDescription: post.shortDescription,
			content: post.content,
			blogId: post.blogId,
			blogName: post.blogName,
			createdAt: post.createdAt,
			extendedLikesInfo: likesInfo,
		};
	}
}
