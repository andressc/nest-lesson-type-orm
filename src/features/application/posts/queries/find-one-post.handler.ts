import { PostModel } from '../../../../database/entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostNotFoundException } from '../../../../common/exceptions';
import { ResponsePostDto } from '../../../dto/posts';
import { QueryPostsRepository } from '../../../infrastructure/query';
import { ObjectIdDto } from '../../../../common/dto';

export class FindOnePostCommand {
	constructor(public id: string, public currentUserId: ObjectIdDto | null) {}
}

@QueryHandler(FindOnePostCommand)
export class FindOnePostHandler implements IQueryHandler<FindOnePostCommand> {
	constructor(private readonly queryPostsRepository: QueryPostsRepository) {}

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
