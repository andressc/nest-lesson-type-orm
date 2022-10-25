import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModel } from '../../../entity/session.schema';

@Injectable()
export class SessionsRepository {
	constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionModel>) {}

	async createNewSession(session: any): Promise<string> {
		const newSession: SessionModel = new this.sessionModel(session);

		const result = await newSession.save();
		return result.id.toString();
	}

	async findSessionModel(userId, deviceId, lastActiveDate): Promise<SessionModel | null> {
		return this.sessionModel.findOne({ userId, deviceId, lastActiveDate });
	}

	async findSessionModelOnDeviceId(deviceId): Promise<SessionModel | null> {
		return this.sessionModel.findOne({ deviceId });
	}

	async updateSession(session, lastActiveDate, expirationDate, ip, userAgent): Promise<void> {
		await session.updateSession(lastActiveDate, expirationDate, ip, userAgent).save();
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
