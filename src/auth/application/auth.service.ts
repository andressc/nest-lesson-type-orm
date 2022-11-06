import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/infrastructure/repository';
import { SessionModel, UserModel } from '../../database/entity';
import { generateHash, payloadDateCreator } from '../../common/helpers';
import {
	RegistrationConfirmationDto,
	RegistrationEmailResendingDto,
	RegistrationDto,
	RefreshTokenDataDto,
	NewPasswordDto,
	PayloadTokenDto,
	ResponseTokensDto,
} from '../dto';
import { ValidationService } from '../../features/application';
import {
	ConfirmCodeBadRequestException,
	EmailBadRequestException,
	UserNotFoundException,
} from '../../common/exceptions';
import { MailerService } from '../../mailer/application/mailer.service';
import { v4 as uuidv4 } from 'uuid';
import { SessionsRepository } from '../../features/infrastructure/repository';
import { AuthConfig } from '../../configuration';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly validationService: ValidationService,
		private readonly authConfig: AuthConfig,
		private readonly mailerService: MailerService,
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

		const newSession: SessionModel = await this.sessionsRepository.createSessionModel({
			lastActiveDate: payloadDateCreator(payload.iat),
			expirationDate: payloadDateCreator(payload.exp),
			deviceId,
			ip,
			title: userAgent,
			userId,
		});

		await this.sessionsRepository.save(newSession);

		return tokens;
	}

	async registration(data: RegistrationDto): Promise<void> {
		await this.validationService.validate(data, RegistrationDto);
		const userId: string = await this.usersService.createUser(data);

		const user: UserModel | null = await this.usersRepository.findUserModel(userId);
		if (!user) throw new UserNotFoundException(userId);

		try {
			await this.mailerService.sendEmailRegistrationMessage(user.email, user.confirmationCode);
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

		user.updateIsConfirmed(true);
		await this.usersRepository.save(user);
	}

	async registrationEmailResending(data: RegistrationEmailResendingDto): Promise<void> {
		await this.validationService.validate(data, RegistrationEmailResendingDto);

		const user: UserModel | null = await this.usersRepository.findUserModelByEmail(data.email);

		if (!user) throw new EmailBadRequestException();
		if (user.isConfirmed) throw new EmailBadRequestException();

		const newConfirmationCode = uuidv4();
		user.updateConfirmationCode(newConfirmationCode);
		await this.usersRepository.save(user);

		try {
			await this.mailerService.sendEmailRegistrationMessage(user.email, user.confirmationCode);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}

	async passwordRecovery(data: RegistrationEmailResendingDto): Promise<void> {
		await this.validationService.validate(data, RegistrationEmailResendingDto);

		const recoveryCode: string = await this.createPasswordRecoveryToken(data.email);

		try {
			await this.mailerService.sendEmailPasswordRecovery(data.email, recoveryCode);
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

		await session.updateSession(
			payloadDateCreator(payload.iat),
			payloadDateCreator(payload.exp),
			refreshTokenData.ip,
			refreshTokenData.userAgent,
		);
		await this.sessionsRepository.save(session);

		return tokens;
	}

	async newPassword(data: NewPasswordDto, userId: string): Promise<void> {
		const user: UserModel | null = await this.usersRepository.findUserModel(userId);
		if (!user) throw new UserNotFoundException(userId);

		await user.updatePassword(data.newPassword);
		await this.usersRepository.save(user);
	}

	private async createTokens(userId, deviceId: string): Promise<ResponseTokensDto> {
		return {
			accessToken: this.jwtService.sign(
				{ sub: userId },
				{
					secret: this.authConfig.getAccessTokenSecret(),
					expiresIn: this.authConfig.getAccessTokenExpiresIn(),
				},
			),
			refreshToken: this.jwtService.sign(
				{ sub: userId, deviceId },
				{
					secret: this.authConfig.getRefreshTokenSecret(),
					expiresIn: this.authConfig.getRefreshTokenExpiresIn(),
				},
			),
		};
	}

	private async createPasswordRecoveryToken(email: string): Promise<string> {
		return this.jwtService.sign(
			{ sub: email },
			{
				secret: this.authConfig.getRecoveryTokenSecret(),
				expiresIn: this.authConfig.getRecoveryTokenExpiresIn(),
			},
		);
	}
}
