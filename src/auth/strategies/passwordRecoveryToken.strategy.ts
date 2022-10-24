import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { UserModel } from '../../entity/user.schema';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { PasswordRecoveryTokenDataDto } from '../dto/passwordRecoveryTokenData.dto';
import { EmailBadRequestException } from '../../common/exceptions/emailBadRequestException';

@Injectable()
export class PasswordRecoveryTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-recovery-password',
) {
	constructor(private readonly usersRepository: UsersRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.body?.recoveryCode;
				},
			]),

			ignoreExpiration: false,
			secretOrKey: jwtConstants.passwordRecoveryToken,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: any): Promise<PasswordRecoveryTokenDataDto> {
		const user: UserModel = await this.usersRepository.findUserModelByEmail(payload.sub);
		if (!user) throw new EmailBadRequestException();

		return {
			userId: user._id,
		};
	}
}
