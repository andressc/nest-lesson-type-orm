import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '../../../../configuration';
import { UsersRepositoryInterface } from '../../../admin/users/interfaces/users.repository.interface';
import { UserModel } from '../../../admin/users/entity/user.schema';
import { UserInjectionToken } from '../../../admin/users/application/user.injection.token';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authConfig: AuthConfig,
		@Inject(UserInjectionToken.USER_REPOSITORY)
		private readonly usersRepository: UsersRepositoryInterface,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfig.getAccessTokenSecret(),
		});
	}

	async validate(payload: any) {
		const user: UserModel = await this.usersRepository.find(payload.sub);
		if (!user) throw new UnauthorizedException();

		return { userId: payload.sub, login: user.login };
	}
}
