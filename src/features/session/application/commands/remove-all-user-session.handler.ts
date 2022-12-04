import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositoryInterface } from '../../interfaces/sessions.repository.interface';
import { InjectSessionsRepository } from '../../infrastructure/providers/sessions-repository.provider';

export class RemoveAllUserSessionCommand implements ICommand {
	constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(RemoveAllUserSessionCommand)
export class RemoveAllUserSessionHandler implements ICommandHandler<RemoveAllUserSessionCommand> {
	constructor(
		@InjectSessionsRepository() private readonly sessionsRepository: SessionsRepositoryInterface,
	) {}

	async execute(command: RemoveAllUserSessionCommand): Promise<void> {
		await this.sessionsRepository.removeAllUserSessionsExceptCurrent(
			command.userId,
			command.deviceId,
		);
	}
}
