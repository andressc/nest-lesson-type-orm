import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '../../configuration/auth.config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authConfig: AuthConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfig.getAccessTokenSecret(),
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub };
	}
}
