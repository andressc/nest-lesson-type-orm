import { Inject, Provider } from '@nestjs/common';
import { QueryUsersRepository } from '../query/query-users.repository';

const provider = 'QueryUsersRepositoryInterface';

export const QueryUsersRepositoryProvider: Provider = {
	provide: provider,
	useClass: QueryUsersRepository,
};

export const InjectQueryUsersRepository = () => Inject(provider);
