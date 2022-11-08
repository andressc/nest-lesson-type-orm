import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseTokensDto } from '../dto';
import { AuthConfig } from '../../configuration';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private readonly authConfig: AuthConfig) {}

	public async createTokens(userId, deviceId: string): Promise<ResponseTokensDto> {
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

	public async createPasswordRecoveryToken(email: string): Promise<string> {
		return this.jwtService.sign(
			{ sub: email },
			{
				secret: this.authConfig.getRecoveryTokenSecret(),
				expiresIn: this.authConfig.getRecoveryTokenExpiresIn(),
			},
		);
	}

	/*async validateUser(login: string, password: string): Promise<UserModel | null> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLogin(login);
		if (!user) throw new UnauthorizedException();

		const passwordHash = await generateHash(password, user.salt);

		if (user && user.password === passwordHash && user.login === login) {
			return user;
		}

		return null;
	}*/

	/*async login(userId: string, ip: string, userAgent: string): Promise<ResponseTokensDto> {
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
	}*/

	/*async registration(data: RegistrationDto): Promise<void> {
		await this.validationService.validate(data, RegistrationDto);
		const userId: string = await this.commandBus.execute(new CreateUserCommand(data));

		const user: UserModel | null = await this.usersRepository.findUserModel(userId);
		if (!user) throw new UserNotFoundException(userId);

		try {
			await this.mailerService.sendEmailRegistrationMessage(user.email, user.confirmationCode);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}*/

	/*async refreshToken(refreshTokenData: RefreshTokenDataDto): Promise<ResponseTokensDto> {
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
	}*/
}
