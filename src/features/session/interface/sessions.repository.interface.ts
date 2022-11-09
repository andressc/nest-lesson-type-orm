import { SessionModel } from '../entity/session.schema';

export abstract class SessionsRepositoryInterface {
	abstract createSessionModel(data: any): Promise<SessionModel>;
	abstract findSessionModel(
		userId: string,
		deviceId: string,
		lastActiveDate: string,
	): Promise<SessionModel | null>;
	abstract findSessionModelOnDeviceId(deviceId: string): Promise<SessionModel | null>;
	abstract removeAllUserSessions(userId: string, deviceId: string): Promise<void>;
	abstract save(sessionModel: SessionModel): Promise<SessionModel>;
	abstract delete(sessionModel: SessionModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
