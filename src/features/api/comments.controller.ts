import { Controller, Get, Body, Param, Delete, HttpCode, Put, UseGuards } from '@nestjs/common';
import { ObjectIdDto } from '../../common/dto/object-id.dto';
import { QueryCommentsRepository } from './query/query-comments.repository';
import { UpdateCommentDto } from '../dto/comments/update-comment.dto';
import { CommentsService } from '../application/comments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';

@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly queryCommentsRepository: QueryCommentsRepository,
	) {}

	@Get(':id')
	findOneComment(@Param() param: ObjectIdDto) {
		return this.queryCommentsRepository.findOneComment(param.id);
	}

	@HttpCode(204)
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async updateComment(
		@Param() param: ObjectIdDto,
		@Body() data: UpdateCommentDto,
		@CurrentUserId() currentUserId,
	) {
		await this.commentsService.updateComment(param.id, data, currentUserId);
	}

	@HttpCode(204)
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async removeComment(@Param() param: ObjectIdDto, @CurrentUserId() currentUserId) {
		await this.commentsService.removeComment(param.id, currentUserId);
	}
}
