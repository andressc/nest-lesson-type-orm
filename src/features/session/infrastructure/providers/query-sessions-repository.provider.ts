import { Inject, Provider } from '@nestjs/common';
import { QuerySessionsRepository } from '../query/query-sessions.repository';

const provider = 'QuerySessionsRepositoryInterface';

export const QuerySessionsRepositoryProvider: Provider = {
	provide: provider,
	useClass: QuerySessionsRepository,
};

export const InjectQuerySessionsRepository = () => Inject(provider);
