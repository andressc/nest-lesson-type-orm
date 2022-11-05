import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentModel } from '../../entity/comment.schema';
import { ValidationService } from './validation.service';
import { UpdateCommentDto, CreateCommentOfPostDto, CreateLikeDto } from '../dto/comments';
import {
	CommentNotFoundException,
	UserNotFoundException,
	PostNotFoundException,
} from '../../common/exceptions';
import { CommentsRepository } from '../infrastructure/repository/comments.repository';
import { createDate } from '../../common/helpers';
import { UserModel } from '../../entity/user.schema';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
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

		const user: UserModel = await this.findUserOrErrorThrow(authUserId);
		await this.findPostOrErrorThrow(postId);

		const newComment: CommentModel = await this.commentsRepository.createCommentModel({
			...data,
			userId: authUserId,
			userLogin: user.login,
			postId,
			createdAt: createDate(),
		});

		const result = await newComment.save();
		return result.id.toString();
	}

	async updateComment(id: string, data: UpdateCommentDto, authUserId: string): Promise<void> {
		await this.validationService.validate(data, UpdateCommentDto);

		await this.findUserOrErrorThrow(authUserId);
		const comment: CommentModel = await this.checkCommentExists(id, authUserId);

		comment.updateData(data);
		await comment.save();
	}

	async removeComment(id: string, authUserId: string): Promise<void> {
		await this.findUserOrErrorThrow(authUserId);

		const comment: CommentModel = await this.checkCommentExists(id, authUserId);
		await comment.delete();
	}

	async setLike(commentId: string, authUserId: string, data: CreateLikeDto): Promise<void> {
		await this.validationService.validate(data, CreateLikeDto);

		const user: UserModel = await this.findUserOrErrorThrow(authUserId);

		const comment: CommentModel = await this.checkCommentExists(commentId, authUserId);

		await comment.setLike(data, authUserId, user.login);
		await comment.save();
	}

	private async checkCommentExists(id: string, authUserId: string): Promise<CommentModel> {
		const comment: CommentModel | null = await this.commentsRepository.findCommentModel(id);
		if (!comment) throw new CommentNotFoundException(id);
		if (comment.userId !== authUserId) throw new ForbiddenException();
		return comment;
	}

	private async findUserOrErrorThrow(id: string): Promise<UserModel> {
		const user: UserModel = await this.usersRepository.findUserModel(id);
		if (!user) throw new UserNotFoundException(id);
		return user;
	}

	private async findPostOrErrorThrow(id: string): Promise<PostModel> {
		const post: PostModel = await this.postsRepository.findPostModel(id);
		if (!post) throw new PostNotFoundException(id);
		return post;
	}
}
