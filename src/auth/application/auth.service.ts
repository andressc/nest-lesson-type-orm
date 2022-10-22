import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { UserModel } from '../../entity/user.schema';
import { generateHash } from '../../common/helpers/generateHash.helper';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { ValidationService } from '../../features/application/validation.service';
import { UserNotFoundException } from '../../common/exceptions/UserNotFoundException';
import { emailManager } from '../../common/mailer/email-manager';
import { RegistrationDto } from '../dto/registration.dto';
import { ConfirmCodeBadRequestException } from '../../common/exceptions/confirmCodeBadRequestException';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { EmailBadRequestException } from '../../common/exceptions/emailBadRequestException';
import { v4 as uuidv4 } from 'uuid';
import { jwtConstants } from '../constants';
import { AuthRepository } from '../infrastructure/repository/auth-repository';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository,
		private readonly authRepository: AuthRepository,
		private readonly validationService: ValidationService,
	) {}

	async validateUser(login: string, password: string): Promise<UserModel | null> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLogin(login);

		const passwordHash = await generateHash(password, user.salt);

		if (user && user.password === passwordHash && user.login === login) {
			return user;
		}

		return null;
	}

	async createTokens(user: UserModel) {
		const payload = { sub: user._id };
		return {
			accessToken: this.jwtService.sign(payload, {
				secret: jwtConstants.secretAccessToken,
				expiresIn: '10s',
			}),
			refreshToken: this.jwtService.sign(payload, {
				secret: jwtConstants.secretRefreshToken,
				expiresIn: '20s',
			}),
		};
	}

	async registration(data: RegistrationDto): Promise<void> {
		await this.validationService.validate(data, RegistrationDto);
		const userId: string = await this.usersService.createUser(data);

		const user: UserModel | null = await this.usersRepository.findUserModel(userId);
		if (!user) throw new UserNotFoundException(userId);

		try {
			await emailManager.sendEmailRegistrationMessage(user.email, user.confirmationCode);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}

	async registrationConfirmation(data: RegistrationConfirmationDto): Promise<void> {
		await this.validationService.validate(data, RegistrationConfirmationDto);

		const user: UserModel | null = await this.usersRepository.findUserModelByConfirmationCode(
			data.code,
		);

		if (!user) throw new ConfirmCodeBadRequestException();
		if (user.isConfirmed) throw new ConfirmCodeBadRequestException();

		await this.usersRepository.updateIsConfirmed(user);
	}

	async registrationEmailResending(data: RegistrationEmailResendingDto): Promise<void> {
		await this.validationService.validate(data, RegistrationEmailResendingDto);

		const user: UserModel | null = await this.usersRepository.findUserModelByEmail(data.email);

		if (!user) throw new EmailBadRequestException();
		if (user.isConfirmed) throw new EmailBadRequestException();

		const newConfirmationCode = uuidv4();
		await this.usersRepository.updateConfirmationCode(user, newConfirmationCode);

		try {
			await emailManager.sendEmailRegistrationMessage(user.email, user.confirmationCode);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}

	async refreshToken(userId: string, token: string) {
		const tokenValidation = await this.authRepository.findRefreshToken(token);
		if (tokenValidation) throw new UnauthorizedException();

		const oldRefreshToken = await this.authRepository.createRefreshToken(token);
		if (!oldRefreshToken) throw new UnauthorizedException();

		const user: UserModel = await this.usersRepository.findUserModel(userId);
		if (!user) throw new UnauthorizedException();

		return await this.createTokens(user);
	}

	async destroyRefreshToken(token: string): Promise<void> {
		const tokenValidation = await this.authRepository.findRefreshToken(token);
		if (tokenValidation) throw new UnauthorizedException();

		const oldRefreshToken = await this.authRepository.createRefreshToken(token);
		if (!oldRefreshToken) throw new UnauthorizedException();
	}
}
