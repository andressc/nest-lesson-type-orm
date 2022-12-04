import { Inject, Provider } from '@nestjs/common';
import { SessionsRepository } from '../repository/sessions.repository';

const provider = 'SessionsRepositoryInterface';

export const SessionsRepositoryProvider: Provider = {
	provide: provider,
	useClass: SessionsRepository,
};

export const InjectSessionsRepository = () => Inject(provider);
