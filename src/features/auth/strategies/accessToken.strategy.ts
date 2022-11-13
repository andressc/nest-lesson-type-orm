import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '../../../configuration';
import { UsersRepositoryAdapter } from '../../users/adapters/users.repository.adapter';
import { UserModel } from '../../users/entity/user.schema';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authConfig: AuthConfig,
		private readonly usersRepository: UsersRepositoryAdapter,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfig.getAccessTokenSecret(),
		});
	}

	async validate(payload: any) {
		const user: UserModel = await this.usersRepository.findUserModel(payload.sub);
		if (!user) throw new UnauthorizedException();

		return { userId: payload.sub, login: user.login };
	}
}
