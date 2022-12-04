import { Inject, Provider } from '@nestjs/common';
import { QueryCommentsRepository } from '../query/query-comments.repository';

const provider = 'QueryCommentsRepositoryInterface';

export const QueryCommentsRepositoryProvider: Provider = {
	provide: provider,
	useClass: QueryCommentsRepository,
};

export const InjectQueryCommentsRepository = () => Inject(provider);
