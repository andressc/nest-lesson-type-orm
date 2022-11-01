import { Controller, Get, Body, Param, Delete, HttpCode, Put, UseGuards } from '@nestjs/common';
import { ObjectIdDto } from '../../common/dto/object-id.dto';
import { QueryCommentsRepository } from './query/query-comments.repository';
import { UpdateCommentDto, CreateLikeDto } from '../dto/comments';
import { CommentsService } from '../application/comments.service';
import { AccessTokenGuard } from '../../common/guards';
import { CurrentUserId } from '../../common/decorators';
import { GuestGuard } from '../../common/guards/guest.guard';
import { CurrentUserIdNonAuthorized } from '../../common/decorators';

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
		@CurrentUserIdNonAuthorized() currentUserId: ObjectIdDto | null,
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
