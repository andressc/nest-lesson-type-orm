import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositoryInterface } from '../../interface/sessions.repository.interface';

export class RemoveAllUserSessionCommand implements ICommand {
	constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(RemoveAllUserSessionCommand)
export class RemoveAllUserSessionHandler implements ICommandHandler<RemoveAllUserSessionCommand> {
	constructor(private readonly sessionsRepository: SessionsRepositoryInterface) {}

	async execute(command: RemoveAllUserSessionCommand): Promise<void> {
		await this.sessionsRepository.removeAllUserSessionsExceptCurrent(
			command.userId,
			command.deviceId,
		);
	}
}
