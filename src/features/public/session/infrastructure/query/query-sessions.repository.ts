import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModel } from '../../entity/session.schema';
import { QuerySessionsRepositoryAdapter } from '../../interfaces/query.sessions.repository.adapter';

@Injectable()
export class QuerySessionsRepository implements QuerySessionsRepositoryAdapter {
	constructor(
		@InjectModel(Session.name)
		private readonly sessionModel: Model<SessionModel>,
	) {}

	async findAllSessionsByUserId(currentUserId: string): Promise<SessionModel[]> {
		return this.sessionModel.find({
			userId: currentUserId,
		});
	}
}
