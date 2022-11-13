import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { DeviceIdNotFoundException } from '../../../../common/exceptions';
import { ForbiddenException } from '@nestjs/common';
import { SessionModel } from '../../entity/session.schema';
import { SessionsRepositoryAdapter } from '../../adapters/sessions.repository.adapter';

export class RemoveUserSessionCommand implements ICommand {
	constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(RemoveUserSessionCommand)
export class RemoveUserSessionHandler implements ICommandHandler<RemoveUserSessionCommand> {
	constructor(private readonly sessionsRepository: SessionsRepositoryAdapter) {}

	async execute(command: RemoveUserSessionCommand): Promise<void> {
		const session: SessionModel | null = await this.sessionsRepository.findSessionModelOnDeviceId(
			command.deviceId,
		);
		if (!session) throw new DeviceIdNotFoundException(command.deviceId);
		if (session.userId !== command.userId) throw new ForbiddenException();

		await this.sessionsRepository.delete(session);
	}
}
