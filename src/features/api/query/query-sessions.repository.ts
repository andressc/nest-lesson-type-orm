import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModel } from '../../../database/entity';
import { ResponseSessionDto } from '../../dto/sessions';

@Injectable()
export class QuerySessionsRepository {
	constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionModel>) {}

	async findAllSessions(currentUserId: string): Promise<ResponseSessionDto[]> {
		const session: SessionModel[] | null = await this.sessionModel.find({ userId: currentUserId });

		return this.mapSessions(session);
	}

	private mapSessions(session: SessionModel[]) {
		return session.map((v: SessionModel) => ({
			ip: v.ip,
			title: v.title,
			lastActiveDate: v.lastActiveDate,
			deviceId: v.deviceId,
		}));
	}
}
