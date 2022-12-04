import { Inject, Provider } from '@nestjs/common';
import { BlogsRepository } from '../repository/blogs.repository';

const provider = 'BlogsRepositoryInterface';

export const BlogsRepositoryProvider: Provider = {
	provide: provider,
	useClass: BlogsRepository,
};

export const InjectBlogsRepository = () => Inject(provider);
