import { Inject, Provider } from '@nestjs/common';
import { LikesRepository } from '../repository/likes.repository';

const provider = 'LikesRepositoryInterface';

export const LikesRepositoryProvider: Provider = {
	provide: provider,
	useClass: LikesRepository,
};

export const InjectLikesRepository = () => Inject(provider);
