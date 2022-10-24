import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { RefreshTokenDataDto } from '../dto/refreshTokenData.dto';
import { UserModel } from '../../entity/user.schema';
import { SessionModel } from '../../entity/session.schema';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { SessionsRepository } from '../../features/infrastructure/repository/sessions.repository';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.refreshToken;
				},
			]),

			ignoreExpiration: false,
			secretOrKey: jwtConstants.secretRefreshToken,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: any): Promise<RefreshTokenDataDto> {
		const user: UserModel = await this.usersRepository.findUserModel(payload.sub);
		if (!user) throw new UnauthorizedException();

		const session: SessionModel | null = await this.sessionsRepository.findSessionModel(
			payload.sub,
			payload.deviceId,
			payload.lastActiveDate,
		);
		if (!session) throw new UnauthorizedException();

		return {
			userId: payload.sub,
			deviceId: payload.deviceId,
			lastActiveDate: payload.lastActiveDate,
			userAgent: req.headers['user-agent'],
			ip: req.ip,
		};
	}
}
