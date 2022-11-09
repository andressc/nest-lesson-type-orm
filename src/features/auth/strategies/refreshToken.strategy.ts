import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { RefreshTokenDataDto, PayloadTokenDto } from '../dto';
import { UsersRepository } from '../../users/infrastructure/repository';
import { payloadDateCreator } from '../../../common/helpers';
import { AuthConfig } from '../../../configuration';
import { SessionsRepository } from '../../session/infrastructure/repository/sessions.repository';
import { UserModel } from '../../users/entity/user.schema';
import { SessionModel } from '../../session/entity/session.schema';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
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
		const user: UserModel = await this.usersRepository.findUserModel(payload.sub);
		if (!user) throw new UnauthorizedException();

		const session: SessionModel | null = await this.sessionsRepository.findSessionModel(
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
