import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { PayloadTokenDto, ResponseTokensDto } from '../../dto';
import { payloadDateCreator } from '../../../../common/helpers';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { SessionModel } from '../../../session/domain/session.schema';
import { SessionsRepositoryInterface } from '../../../session/interfaces/sessions.repository.interface';
import { InjectSessionsRepository } from '../../../session/infrastructure/providers/sessions-repository.provider';

export class LoginAuthCommand {
	constructor(public userId: string, public ip: string, public userAgent: string) {}
}

@CommandHandler(LoginAuthCommand)
export class LoginAuthHandler implements ICommandHandler<LoginAuthCommand> {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		@InjectSessionsRepository() private readonly sessionsRepository: SessionsRepositoryInterface,
	) {}

	async execute(command: LoginAuthCommand): Promise<ResponseTokensDto> {
		const deviceId = uuidv4();
		const tokens: ResponseTokensDto = await this.authService.createTokens(command.userId, deviceId);
		const payload: PayloadTokenDto = this.jwtService.decode(tokens.refreshToken) as PayloadTokenDto;

		const newSession: SessionModel = await this.sessionsRepository.create({
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
