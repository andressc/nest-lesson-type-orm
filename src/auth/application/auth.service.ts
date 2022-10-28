import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { UserModel } from '../../entity/user.schema';
import { generateHash, payloadDateCreator } from '../../common/helpers';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { ValidationService } from '../../features/application/validation.service';
import {
	UserNotFoundException,
	ConfirmCodeBadRequestException,
	EmailBadRequestException,
} from '../../common/exceptions';
import { emailManager } from '../../common/mailer/email-manager';
import { RegistrationDto } from '../dto/registration.dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { v4 as uuidv4 } from 'uuid';
import { jwtConstants } from '../constants';
import { RefreshTokenDataDto } from '../dto/refreshTokenData.dto';
import { SessionModel } from '../../entity/session.schema';
import { SessionsRepository } from '../../features/infrastructure/repository/sessions.repository';
import { NewPasswordDto } from '../dto/newPassword.dto';
import { PayloadTokenDto } from '../dto/payloadToken.dto';
import { ResponseTokensDto } from '../dto/responseTokens.dto';

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

	async login(userId: string, ip: string, userAgent: string): Promise<ResponseTokensDto> {
		const deviceId = uuidv4();
		const tokens: ResponseTokensDto = await this.createTokens(userId, deviceId);
		const payload: PayloadTokenDto = this.jwtService.decode(tokens.refreshToken) as PayloadTokenDto;

		await this.sessionsRepository.createNewSession({
			lastActiveDate: payloadDateCreator(payload.iat),
			expirationDate: payloadDateCreator(payload.exp),
			deviceId,
			ip,
			title: userAgent,
			userId,
		});

		return tokens;
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

	async passwordRecovery(data: RegistrationEmailResendingDto): Promise<void> {
		await this.validationService.validate(data, RegistrationEmailResendingDto);

		const recoveryCode: string = await this.createPasswordRecoveryToken(data.email);

		try {
			await emailManager.sendEmailPasswordRecovery(data.email, recoveryCode);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}

	async refreshToken(refreshTokenData: RefreshTokenDataDto): Promise<ResponseTokensDto> {
		const session: SessionModel | null = await this.sessionsRepository.findSessionModel(
			refreshTokenData.userId,
			refreshTokenData.deviceId,
			refreshTokenData.lastActiveDate,
		);
		if (!session) throw new UnauthorizedException();

		const tokens: ResponseTokensDto = await this.createTokens(
			refreshTokenData.userId,
			refreshTokenData.deviceId,
		);
		const payload: PayloadTokenDto = this.jwtService.decode(tokens.refreshToken) as PayloadTokenDto;

		await this.sessionsRepository.updateSession(
			session,
			payloadDateCreator(payload.iat),
			payloadDateCreator(payload.exp),
			refreshTokenData.ip,
			refreshTokenData.userAgent,
		);

		return tokens;
	}

	async newPassword(data: NewPasswordDto, userId: string): Promise<void> {
		const user: UserModel | null = await this.usersRepository.findUserModel(userId);
		if (!user) throw new UserNotFoundException(userId);

		await this.usersRepository.updatePassword(user, data.newPassword);
	}

	private async createTokens(userId, deviceId: string): Promise<ResponseTokensDto> {
		return {
			accessToken: this.jwtService.sign(
				{ sub: userId },
				{
					secret: jwtConstants.secretAccessToken,
					expiresIn: '10m',
				},
			),
			refreshToken: this.jwtService.sign(
				{ sub: userId, deviceId },
				{
					secret: jwtConstants.secretRefreshToken,
					expiresIn: '20m',
				},
			),
		};
	}

	private async createPasswordRecoveryToken(email: string): Promise<string> {
		return this.jwtService.sign(
			{ sub: email },
			{
				secret: jwtConstants.passwordRecoveryToken,
				expiresIn: '10m',
			},
		);
	}
}
