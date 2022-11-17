import { SessionModel } from '../entity/session.schema';
import { MainRepositoryInterface } from '../../interfaces/main.repository.interface';

/* eslint-disable */
export interface SessionsRepositoryInterface
	extends MainRepositoryInterface<SessionModel, any /* надо DTO запилить! */> {
	findSession(
		userId: string,
		deviceId: string,
		lastActiveDate: string,
	): Promise<SessionModel | null>;
	findSessionOnDeviceId(deviceId: string): Promise<SessionModel | null>;
	removeAllUserSessionsExceptCurrent(userId: string, deviceId: string): Promise<void>;
	removeAllUserSessions(userId: string): Promise<void>;
}
