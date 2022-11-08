import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModel } from '../../../database/entity';

@Injectable()
export class QuerySessionsRepository {
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
