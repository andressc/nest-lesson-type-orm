import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModel } from '../../../entity/session.schema';

@Injectable()
export class SessionsRepository {
	constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionModel>) {}

	async createNewSessionModel(session: any): Promise<SessionModel> {
		return new this.sessionModel(session);
	}

	async findSessionModel(userId, deviceId, lastActiveDate): Promise<SessionModel | null> {
		return this.sessionModel.findOne({ userId, deviceId, lastActiveDate });
	}

	async findSessionModelOnDeviceId(deviceId): Promise<SessionModel | null> {
		return this.sessionModel.findOne({ deviceId });
	}

	async removeAllUserSessions(userId: string, deviceId: string): Promise<void> {
		await this.sessionModel.deleteMany({ userId: { $eq: userId }, deviceId: { $ne: deviceId } });
	}

	async removeUserSession(userId: string, deviceId: string): Promise<void> {
		await this.sessionModel.deleteOne({ userId, deviceId });
	}

	async deleteAll(): Promise<void> {
		await this.sessionModel.deleteMany();
	}
}
