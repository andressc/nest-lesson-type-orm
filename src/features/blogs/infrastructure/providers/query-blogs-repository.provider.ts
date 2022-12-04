import { Inject, Provider } from '@nestjs/common';
import { QueryBlogsRepository } from '../query/query-blogs.repository';

const provider = 'QueryBlogsRepositoryInterface';

export const QueryBlogsRepositoryProvider: Provider = {
	provide: provider,
	useClass: QueryBlogsRepository,
};

export const InjectQueryBlogsRepository = () => Inject(provider);
