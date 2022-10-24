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
import { createDate } from '../../common/helpers/date.helper';
import { RefreshTokenDataDto } from '../dto/refreshTokenData.dto';
import { SessionModel } from '../../entity/session.schema';
import { SessionsRepository } from '../../features/infrastructure/repository/sessions.repository';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly validationService: ValidationService,
	) {}

	async validateUser(login: string, password: string): Promise<UserModel | null> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLogin(login);
		if (!user) throw new UnauthorizedException();

		const passwordHash = await generateHash(password, user.salt);

		if (user && user.password === passwordHash && user.login === login) {
			return user;
		}

		return null;
	}

	async login(userId: string, ip: string, userAgent: string) {
		const lastActiveDate = createDate();
		const deviceId = uuidv4();

		await this.sessionsRepository.createNewSession({
			lastActiveDate,
			deviceId,
			ip,
			title: userAgent,
			userId,
		});

		return this.createTokens(userId, lastActiveDate, deviceId);
	}

	async createTokens(userId, lastActiveDate: string, deviceId: string) {
		return {
			accessToken: this.jwtService.sign(
				{ sub: userId },
				{
					secret: jwtConstants.secretAccessToken,
					expiresIn: '10s',
				},
			),
			refreshToken: this.jwtService.sign(
				{ sub: userId, deviceId, lastActiveDate },
				{
					secret: jwtConstants.secretRefreshToken,
					expiresIn: '20s',
				},
			),
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

	async refreshToken(refreshTokenData: RefreshTokenDataDto) {
		const session: SessionModel | null = await this.sessionsRepository.findSessionModel(
			refreshTokenData.userId,
			refreshTokenData.deviceId,
			refreshTokenData.lastActiveDate,
		);
		if (!session) throw new UnauthorizedException();

		const lastActiveDate = createDate();
		await this.sessionsRepository.updateSession(
			session,
			lastActiveDate,
			refreshTokenData.ip,
			refreshTokenData.userAgent,
		);

		return await this.createTokens(
			refreshTokenData.userId,
			lastActiveDate,
			refreshTokenData.deviceId,
		);
	}
}
