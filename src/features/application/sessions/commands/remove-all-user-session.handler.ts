import { SessionsRepository } from '../../../infrastructure/repository';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class RemoveAllUserSessionCommand implements ICommand {
	constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(RemoveAllUserSessionCommand)
export class RemoveAllUserSessionHandler implements ICommandHandler<RemoveAllUserSessionCommand> {
	constructor(private readonly sessionsRepository: SessionsRepository) {}

	async execute(command: RemoveAllUserSessionCommand): Promise<void> {
		await this.sessionsRepository.removeAllUserSessions(command.userId, command.deviceId);
	}
}
