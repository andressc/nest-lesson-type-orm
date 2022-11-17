import { SessionModel } from '../entity/session.schema';

export interface QuerySessionsRepositoryInterface {
	findAllSessionsByUserId(currentUserId: string): Promise<SessionModel[]>;
}
