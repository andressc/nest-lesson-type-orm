import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { DeviceIdNotFoundException } from '../../../../common/exceptions';
import { ForbiddenException } from '@nestjs/common';
import { SessionModel } from '../../domain/session.schema';
import { SessionsRepositoryInterface } from '../../interfaces/sessions.repository.interface';
import { InjectSessionsRepository } from '../../infrastructure/providers/sessions-repository.provider';

export class RemoveUserSessionCommand implements ICommand {
	constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(RemoveUserSessionCommand)
export class RemoveUserSessionHandler implements ICommandHandler<RemoveUserSessionCommand> {
	constructor(
		@InjectSessionsRepository() private readonly sessionsRepository: SessionsRepositoryInterface,
	) {}

	async execute(command: RemoveUserSessionCommand): Promise<void> {
		const session: SessionModel | null = await this.sessionsRepository.findSessionOnDeviceId(
			command.deviceId,
		);
		if (!session) throw new DeviceIdNotFoundException(command.deviceId);
		if (session.userId !== command.userId) throw new ForbiddenException();

		await this.sessionsRepository.delete(session);
	}
}
