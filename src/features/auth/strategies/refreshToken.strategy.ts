import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { RefreshTokenDataDto, PayloadTokenDto } from '../dto';
import { payloadDateCreator } from '../../../common/helpers';
import { AuthConfig } from '../../../configuration';
import { UserModel } from '../../users/domain/user.schema';
import { SessionModel } from '../../session/domain/session.schema';
import { SessionsRepositoryInterface } from '../../session/interfaces/sessions.repository.interface';
import { UsersRepositoryInterface } from '../../users/interfaces/users.repository.interface';
import { InjectUsersRepository } from '../../users/infrastructure/providers/users-repository.provider';
import { InjectSessionsRepository } from '../../session/infrastructure/providers/sessions-repository.provider';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
		@InjectSessionsRepository() private readonly sessionsRepository: SessionsRepositoryInterface,
		private readonly authConfig: AuthConfig,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.refreshToken;
				},
			]),

			ignoreExpiration: false,
			secretOrKey: authConfig.getRefreshTokenSecret(),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: PayloadTokenDto): Promise<RefreshTokenDataDto> {
		const user: UserModel = await this.usersRepository.find(payload.sub);
		if (!user) throw new UnauthorizedException();

		const session: SessionModel | null = await this.sessionsRepository.findSession(
			payload.sub,
			payload.deviceId,
			payloadDateCreator(payload.iat),
		);
		if (!session) throw new UnauthorizedException();

		return {
			userId: payload.sub,
			deviceId: payload.deviceId,
			lastActiveDate: payloadDateCreator(payload.iat),
			userAgent: req.headers['user-agent'],
			ip: req.ip,
		};
	}
}
