import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostNotFoundException } from '../../../../../common/exceptions';
import { ResponsePostDto } from '../../dto';
import { PostModel } from '../../entity/post.schema';
import { QueryPostsRepositoryAdapter } from '../../adapters/query.posts.repository.adapter';
import { ObjectId } from 'mongodb';

export class FindOnePostCommand {
	constructor(public id: string, public currentUserId: string | null) {}
}

@QueryHandler(FindOnePostCommand)
export class FindOnePostHandler implements IQueryHandler<FindOnePostCommand> {
	constructor(private readonly queryPostsRepository: QueryPostsRepositoryAdapter) {}

	async execute(command: FindOnePostCommand): Promise<ResponsePostDto | null> {
		const post: PostModel[] | null = await this.queryPostsRepository.findPostModel(
			new ObjectId(command.id),
		);
		if (!post[0]) throw new PostNotFoundException(command.id);

		const postModel = post[0];

		const extendedLikesInfo = this.queryPostsRepository.countLikes(
			postModel,
			command.currentUserId,
		);

		return {
			id: postModel._id.toString(),
			title: postModel.title,
			shortDescription: postModel.shortDescription,
			content: postModel.content,
			blogId: postModel.blogId,
			blogName: postModel.blogName,
			createdAt: postModel.createdAt,
			extendedLikesInfo,
		};
	}
}
