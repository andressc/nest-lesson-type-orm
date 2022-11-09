import { SessionModel } from '../entity/session.schema';

export abstract class QuerySessionsRepositoryInterface {
	abstract findAllSessionsByUserId(currentUserId: string): Promise<SessionModel[]>;
}
