import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositoryAdapter } from '../../adapters/sessions.repository.adapter';

export class RemoveAllUserSessionCommand implements ICommand {
	constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(RemoveAllUserSessionCommand)
export class RemoveAllUserSessionHandler implements ICommandHandler<RemoveAllUserSessionCommand> {
	constructor(private readonly sessionsRepository: SessionsRepositoryAdapter) {}

	async execute(command: RemoveAllUserSessionCommand): Promise<void> {
		await this.sessionsRepository.removeAllUserSessionsExceptCurrent(
			command.userId,
			command.deviceId,
		);
	}
}
