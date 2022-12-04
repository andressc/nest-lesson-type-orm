import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PayloadTokenDto, RefreshTokenDataDto, ResponseTokensDto } from '../../dto';
import { payloadDateCreator } from '../../../../common/helpers';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { SessionModel } from '../../../session/domain/session.schema';
import { SessionsRepositoryInterface } from '../../../session/interfaces/sessions.repository.interface';
import { InjectSessionsRepository } from '../../../session/infrastructure/providers/sessions-repository.provider';

export class RefreshTokenAuthCommand {
	constructor(public refreshTokenData: RefreshTokenDataDto) {}
}

@CommandHandler(RefreshTokenAuthCommand)
export class RefreshTokenAuthHandler implements ICommandHandler<RefreshTokenAuthCommand> {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		@InjectSessionsRepository() private readonly sessionsRepository: SessionsRepositoryInterface,
	) {}

	async execute(command: RefreshTokenAuthCommand): Promise<ResponseTokensDto> {
		const session: SessionModel | null = await this.sessionsRepository.findSession(
			command.refreshTokenData.userId,
			command.refreshTokenData.deviceId,
			command.refreshTokenData.lastActiveDate,
		);
		if (!session) throw new UnauthorizedException();

		const tokens: ResponseTokensDto = await this.authService.createTokens(
			command.refreshTokenData.userId,
			command.refreshTokenData.deviceId,
		);
		const payload: PayloadTokenDto = this.jwtService.decode(tokens.refreshToken) as PayloadTokenDto;

		await session.updateSession(
			payloadDateCreator(payload.iat),
			payloadDateCreator(payload.exp),
			command.refreshTokenData.ip,
			command.refreshTokenData.userAgent,
		);
		await this.sessionsRepository.save(session);

		return tokens;
	}
}
