import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModel } from '../../../database/entity';
import { SessionsRepositoryInterface } from './interfaces';

@Injectable()
export class SessionsRepository implements SessionsRepositoryInterface {
	constructor(
		@InjectModel(Session.name)
		private readonly sessionModel: Model<SessionModel>,
	) {}

	async createSessionModel(session: any): Promise<SessionModel> {
		return new this.sessionModel(session);
	}

	async findSessionModel(
		userId: string,
		deviceId: string,
		lastActiveDate: string,
	): Promise<SessionModel | null> {
		return this.sessionModel.findOne({
			userId,
			deviceId,
			lastActiveDate,
		});
	}

	async findSessionModelOnDeviceId(deviceId: string): Promise<SessionModel | null> {
		return this.sessionModel.findOne({
			deviceId,
		});
	}

	async removeAllUserSessions(userId: string, deviceId: string): Promise<void> {
		await this.sessionModel.deleteMany({
			userId: { $eq: userId },
			deviceId: { $ne: deviceId },
		});
	}

	async save(sessionModel: SessionModel): Promise<SessionModel> {
		return sessionModel.save();
	}

	async delete(sessionModel: SessionModel): Promise<void> {
		await sessionModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.sessionModel.deleteMany();
	}
}
