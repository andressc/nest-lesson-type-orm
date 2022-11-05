import { ForbiddenException, Injectable } from '@nestjs/common';
import { SessionModel } from '../../database/entity/session.schema';
import { SessionsRepository } from '../infrastructure/repository/sessions.repository';
import { DeviceIdNotFoundException } from '../../common/exceptions';

@Injectable()
export class SessionsService {
	constructor(private readonly sessionsRepository: SessionsRepository) {}

	async removeAllUserSessions(userId: string, deviceId: string): Promise<void> {
		await this.sessionsRepository.removeAllUserSessions(userId, deviceId);
	}

	async removeUserSession(userId: string, deviceId: string): Promise<void> {
		const session: SessionModel | null = await this.sessionsRepository.findSessionModelOnDeviceId(
			deviceId,
		);
		if (!session) throw new DeviceIdNotFoundException(deviceId);
		if (session.userId !== userId) throw new ForbiddenException();

		await this.sessionsRepository.removeUserSession(userId, deviceId);
	}
}
