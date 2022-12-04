import { QueryBlogDto } from '../../dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationCalc, PaginationDto } from '../../../../common/dto';
import { PaginationService } from '../../../../shared/pagination/application/pagination.service';
import { QueryBlogsRepositoryInterface } from '../../interfaces/query.blogs.repository.interface';
import { ForbiddenException } from '@nestjs/common';
import { ResponseBannedBlogOfUserDto } from '../../dto/response-banned-blog-of-user.dto';
import { BanModel } from '../../domain/ban.schema';
import { BlogsRepositoryInterface } from '../../interfaces/blogs.repository.interface';
import { BlogModel } from '../../domain/blog.schema';
import { BlogsService } from '../blogs.service';
import { InjectBlogsRepository } from '../../infrastructure/providers/blogs-repository.provider';
import { InjectQueryBlogsRepository } from '../../infrastructure/providers/query-blogs-repository.provider';

export class FindAllBannedBlogOfUserCommand {
	constructor(public blogId: string, public query: QueryBlogDto, public currentUserId: string) {}
}

@QueryHandler(FindAllBannedBlogOfUserCommand)
export class FindAllBannedBlogOfUserHandler
	implements IQueryHandler<FindAllBannedBlogOfUserCommand>
{
	constructor(
		private readonly blogsService: BlogsService,
		@InjectQueryBlogsRepository()
		private readonly queryBlogsRepository: QueryBlogsRepositoryInterface,
		@InjectBlogsRepository() private readonly blogsRepository: BlogsRepositoryInterface,
		private readonly paginationService: PaginationService,
	) {}

	async execute(
		command: FindAllBannedBlogOfUserCommand,
	): Promise<PaginationDto<ResponseBannedBlogOfUserDto[]>> {
		const searchString = command.query.searchNameTerm
			? {
					blogName: {
						$regex: command.query.searchNameTerm,
						$options: 'i',
					},
					blogId: command.blogId,
					isBanned: true,
			  }
			: { blogId: command.blogId, isBanned: true };

		const blog: BlogModel = await this.blogsService.findBlogOrErrorThrow(command.blogId);
		if (blog.userId !== command.currentUserId) throw new ForbiddenException();

		const totalCount: number = await this.queryBlogsRepository.countBan(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const ban: BanModel[] = await this.queryBlogsRepository.findBanModel(
			searchString,
			paginationData.sortBy,
			paginationData.skip,
			paginationData.pageSize,
		);

		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: ban.map((v: BanModel) => ({
				id: v.userId,
				login: v.login,
				banInfo: {
					isBanned: v.isBanned,
					banDate: v.banDate,
					banReason: v.banReason,
				},
			})),
		};
	}
}
