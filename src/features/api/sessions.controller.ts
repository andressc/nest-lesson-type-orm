import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { QuerySessionsRepository } from './query';
import { SessionsService } from '../application';
import { RefreshTokenGuard } from '../../common/guards';
import { RefreshTokenDataDto } from '../../auth/dto';
import { StringIdDto } from '../../common/dto';
import { RefreshTokenData } from '../../common/decorators/Param';

@Controller('security')
export class SessionsController {
	constructor(
		private readonly sessionsService: SessionsService,
		private readonly querySessionsRepository: QuerySessionsRepository,
	) {}

	@UseGuards(RefreshTokenGuard)
	@Get('/devices')
	findAllSessions(
		@RefreshTokenData()
		refreshTokenData: RefreshTokenDataDto,
	) {
		return this.querySessionsRepository.findAllSessions(refreshTokenData.userId);
	}

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Delete('/devices')
	async removeAllUserSessions(
		@RefreshTokenData()
		refreshTokenData: RefreshTokenDataDto,
	) {
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
		@RefreshTokenData()
		refreshTokenData: RefreshTokenDataDto,
	) {
		await this.sessionsService.removeUserSession(refreshTokenData.userId, param.id);
	}
}
