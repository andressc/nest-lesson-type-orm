import { Inject, Provider } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';

const provider = 'PostsRepositoryInterface';

export const PostsRepositoryProvider: Provider = {
	provide: provider,
	useClass: PostsRepository,
};

export const InjectPostsRepository = () => Inject(provider);
