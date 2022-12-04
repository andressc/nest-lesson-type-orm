import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PasswordRecoveryTokenDataDto } from '../dto';
import { EmailBadRequestException } from '../../../common/exceptions';
import { AuthConfig } from '../../../configuration';
import { UserModel } from '../../users/domain/user.schema';
import { UsersRepositoryInterface } from '../../users/interfaces/users.repository.interface';
import { InjectUsersRepository } from '../../users/infrastructure/providers/users-repository.provider';

@Injectable()
export class PasswordRecoveryTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-recovery-password',
) {
	constructor(
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
		private readonly authConfig: AuthConfig,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.body?.recoveryCode;
				},
			]),

			ignoreExpiration: false,
			secretOrKey: authConfig.getRecoveryTokenSecret(),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: { sub: string }): Promise<PasswordRecoveryTokenDataDto> {
		const user: UserModel = await this.usersRepository.findUserByEmail(payload.sub);
		if (!user) throw new EmailBadRequestException();

		return {
			userId: user._id,
		};
	}
}
