import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			//jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

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

	validate(req: Request, payload: any) {
		const refreshToken = req.cookies?.refreshToken;
		return { userId: payload.sub, refreshToken };
	}
}
