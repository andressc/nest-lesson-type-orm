import { SessionModel } from '../entity/session.schema';

export abstract class SessionsRepositoryAdapter {
	abstract createSessionModel(data: any): Promise<SessionModel>;
	abstract findSessionModel(
		userId: string,
		deviceId: string,
		lastActiveDate: string,
	): Promise<SessionModel | null>;
	abstract findSessionModelOnDeviceId(deviceId: string): Promise<SessionModel | null>;
	abstract removeAllUserSessionsExceptCurrent(userId: string, deviceId: string): Promise<void>;
	abstract removeAllUserSessions(userId: string): Promise<void>;
	abstract save(sessionModel: SessionModel): Promise<SessionModel>;
	abstract delete(sessionModel: SessionModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
