import { Controller, Get, Delete, HttpCode, UseGuards, Param } from '@nestjs/common';
import { QuerySessionsRepository } from './query/query-sessions.repository';
import { SessionsService } from '../application/sessions.service';
import { RefreshTokenGuard } from '../../common/guards/refreshToken.guard';
import { RefreshTokenData } from '../../common/decorators/refresh-token-data.decorator';
import { RefreshTokenDataDto } from '../../auth/dto/refreshTokenData.dto';
import { StringIdDto } from '../../common/dto/string-id.dto';

@Controller('security')
export class SessionsController {
	constructor(
		private readonly sessionsService: SessionsService,
		private readonly querySessionsRepository: QuerySessionsRepository,
	) {}

	@UseGuards(RefreshTokenGuard)
	@Get('/devices')
	findAllSessions(@RefreshTokenData() refreshTokenData: RefreshTokenDataDto) {
		return this.querySessionsRepository.findAllSessions(refreshTokenData.userId);
	}

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Delete('/devices')
	async removeAllUserSessions(@RefreshTokenData() refreshTokenData: RefreshTokenDataDto) {
		await this.sessionsService.removeAllUserSessions(
			refreshTokenData.userId,
			refreshTokenData.deviceId,
		);
	}

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Delete('/devices/:id')
	async removeUserSession(
		@Param() param: StringIdDto,
		@RefreshTokenData() refreshTokenData: RefreshTokenDataDto,
	) {
		await this.sessionsService.removeUserSession(refreshTokenData.userId, param.id);
	}
}
