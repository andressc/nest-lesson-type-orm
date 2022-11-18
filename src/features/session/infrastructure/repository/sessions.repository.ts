import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SessionsRepositoryInterface } from '../../interfaces/sessions.repository.interface';
import { Session, SessionModel } from '../../entity/session.schema';
import { MainRepository } from '../../../shared/infrastructure/repository/main.repository';
import { CreateSessionDto } from '../../dto/create-session.dto';

@Injectable()
export class SessionsRepository
	extends MainRepository<SessionModel, CreateSessionDto>
	implements SessionsRepositoryInterface
{
	constructor(
		@InjectModel(Session.name)
		private readonly sessionModel: Model<SessionModel>,
	) {
		super(sessionModel);
	}

	async findSession(
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

	async findSessionOnDeviceId(deviceId: string): Promise<SessionModel | null> {
		return this.sessionModel.findOne({
			deviceId,
		});
	}

	async removeAllUserSessionsExceptCurrent(userId: string, deviceId: string): Promise<void> {
		await this.sessionModel.deleteMany({
			userId: { $eq: userId },
			deviceId: { $ne: deviceId },
		});
	}

	async removeAllUserSessions(userId: string): Promise<void> {
		await this.sessionModel.deleteMany({ userId });
	}
}
