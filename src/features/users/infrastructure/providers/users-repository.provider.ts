import { Inject, Provider } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';

const provider = 'UsersRepositoryInterface';

export const UsersRepositoryProvider: Provider = {
	provide: provider,
	useClass: UsersRepository,
};

export const InjectUsersRepository = () => Inject(provider);
