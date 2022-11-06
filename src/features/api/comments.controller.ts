import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { ObjectIdDto } from '../../common/dto';
import { QueryCommentsRepository } from './query';
import { CreateLikeDto, UpdateCommentDto } from '../dto/comments';
import { CommentsService } from '../application';
import { AccessTokenGuard, GuestGuard } from '../../common/guards';
import { CurrentUserId, CurrentUserIdNonAuthorized } from '../../common/decorators/Param';

@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly queryCommentsRepository: QueryCommentsRepository,
	) {}

	@Get(':id')
	@UseGuards(GuestGuard)
	findOneComment(
		@Param() param: ObjectIdDto,
		@CurrentUserIdNonAuthorized()
		currentUserId: ObjectIdDto | null,
	) {
		return this.queryCommentsRepository.findOneComment(param.id, currentUserId);
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Put(':id')
	async updateComment(
		@Param() param: ObjectIdDto,
		@Body() data: UpdateCommentDto,
		@CurrentUserId() currentUserId,
	) {
		await this.commentsService.updateComment(param.id, data, currentUserId);
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Delete(':id')
	async removeComment(@Param() param: ObjectIdDto, @CurrentUserId() currentUserId) {
		await this.commentsService.removeComment(param.id, currentUserId);
	}

	@HttpCode(204)
	@UseGuards(AccessTokenGuard)
	@Put(':id/like-status')
	async setLike(
		@Param() param: ObjectIdDto,
		@CurrentUserId() currentUserId,
		@Body() data: CreateLikeDto,
	) {
		await this.commentsService.setLike(param.id, currentUserId, data);
	}
}
