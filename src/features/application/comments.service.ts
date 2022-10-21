import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentModel } from '../../entity/comment.schema';
import { ValidationService } from './validation.service';
import { UpdateCommentDto } from '../dto/comments/update-comment.dto';
import { CommentNotFoundException } from '../../common/exceptions/CommentNotFoundException';
import { CommentsRepository } from '../infrastructure/repository/comments.repository';
import { createDate } from '../../common/helpers/date.helper';
import { CreateCommentOfPostDto } from '../dto/comments/create-comment-of-post.dto';
import { UserModel } from '../../entity/user.schema';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { UserNotFoundException } from '../../common/exceptions/UserNotFoundException';
import { PostNotFoundException } from '../../common/exceptions/PostNotFoundException';
import { PostModel } from '../../entity/post.schema';
import { PostsRepository } from '../infrastructure/repository/posts.repository';

@Injectable()
export class CommentsService {
	constructor(
		private readonly commentsRepository: CommentsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly postsRepository: PostsRepository,
		private readonly validationService: ValidationService,
	) {}

	async createCommentOfPost(
		data: CreateCommentOfPostDto,
		postId: string,
		authUserId: string,
	): Promise<string> {
		await this.validationService.validate(data, CreateCommentOfPostDto);

		const userLogin: string = await this.checkUserExists(authUserId);
		await this.checkPostExists(postId);

		return this.commentsRepository.createComment({
			...data,
			userId: authUserId,
			userLogin: userLogin,
			postId,
			createdAt: createDate(),
		});
	}

	async updateComment(id: string, data: UpdateCommentDto, authUserId: string): Promise<void> {
		await this.validationService.validate(data, UpdateCommentDto);

		await this.checkUserExists(authUserId);
		const comment: CommentModel = await this.checkCommentExists(id);
		if (comment.userId !== authUserId) throw new ForbiddenException();

		await this.commentsRepository.updateComment(comment, data);
	}

	async removeComment(id: string, authUserId: string): Promise<void> {
		await this.checkUserExists(authUserId);

		const comment: CommentModel = await this.checkCommentExists(id);
		if (comment.userId !== authUserId) throw new ForbiddenException();

		await this.commentsRepository.removeComment(comment);
	}

	private async checkCommentExists(id: string): Promise<CommentModel> {
		const comment: CommentModel | null = await this.commentsRepository.findCommentModel(id);
		if (!comment) throw new CommentNotFoundException(id);
		return comment;
	}

	private async checkUserExists(id: string): Promise<string> {
		const user: UserModel = await this.usersRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user.login;
	}

	private async checkPostExists(id: string): Promise<PostModel> {
		const post: PostModel = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}
}
