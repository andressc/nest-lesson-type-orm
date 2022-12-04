import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '../../../configuration';
import { UsersRepositoryInterface } from '../../users/interfaces/users.repository.interface';
import { UserModel } from '../../users/domain/user.schema';
import { InjectUsersRepository } from '../../users/infrastructure/providers/users-repository.provider';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authConfig: AuthConfig,
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfig.getAccessTokenSecret(),
		});
	}

	async validate(payload: { sub: string }) {
		const user: UserModel = await this.usersRepository.find(payload.sub);
		if (!user) throw new UnauthorizedException();

		return { userId: payload.sub, login: user.login };
	}
}
