import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { PayloadTokenDto, ResponseTokensDto } from '../../dto';
import { SessionModel } from '../../../database/entity';
import { payloadDateCreator } from '../../../common/helpers';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '../../../features/infrastructure/repository';
import { AuthService } from '../auth.service';

export class LoginAuthCommand {
	constructor(public userId: string, public ip: string, public userAgent: string) {}
}

@CommandHandler(LoginAuthCommand)
export class LoginAuthHandler implements ICommandHandler<LoginAuthCommand> {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		private readonly sessionsRepository: SessionsRepository,
	) {}

	async execute(command: LoginAuthCommand): Promise<ResponseTokensDto> {
		const deviceId = uuidv4();
		const tokens: ResponseTokensDto = await this.authService.createTokens(command.userId, deviceId);
		const payload: PayloadTokenDto = this.jwtService.decode(tokens.refreshToken) as PayloadTokenDto;

		const newSession: SessionModel = await this.sessionsRepository.createSessionModel({
			lastActiveDate: payloadDateCreator(payload.iat),
			expirationDate: payloadDateCreator(payload.exp),
			deviceId,
			ip: command.ip,
			title: command.userAgent,
			userId: command.userId,
		});

		await this.sessionsRepository.save(newSession);

		return tokens;
	}
}
