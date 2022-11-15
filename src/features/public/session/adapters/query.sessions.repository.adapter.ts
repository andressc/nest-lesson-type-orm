import { SessionModel } from '../entity/session.schema';

export abstract class QuerySessionsRepositoryAdapter {
	abstract findAllSessionsByUserId(currentUserId: string): Promise<SessionModel[]>;
}
