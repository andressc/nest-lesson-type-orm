import { Inject, Provider } from '@nestjs/common';
import { QueryPostsRepository } from '../query/query-posts.repository';

const provider = 'QueryPostsRepositoryInterface';

export const QueryPostsRepositoryProvider: Provider = {
	provide: provider,
	useClass: QueryPostsRepository,
};

export const InjectQueryPostsRepository = () => Inject(provider);
