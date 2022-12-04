import { Inject, Provider } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';

const provider = 'CommentsRepositoryInterface';

export const CommentsRepositoryProvider: Provider = {
	provide: provider,
	useClass: CommentsRepository,
};

export const InjectCommentsRepository = () => Inject(provider);
