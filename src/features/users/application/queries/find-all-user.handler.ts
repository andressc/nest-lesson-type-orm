import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryUserDto, ResponseUserDto } from '../../dto';
import { PaginationCalc, PaginationDto } from '../../../../common/dto';
import { UserModel } from '../../domain/user.schema';
import { PaginationService } from '../../../../shared/pagination/application/pagination.service';
import { QueryUsersRepositoryInterface } from '../../interfaces/query.users.repository.interface';
import { InjectQueryUsersRepository } from '../../infrastructure/providers/query-users-repository.provider';

export class FindAllUserCommand {
	constructor(public query: QueryUserDto) {}
}

@QueryHandler(FindAllUserCommand)
export class FindAllUserHandler implements IQueryHandler<FindAllUserCommand> {
	constructor(
		@InjectQueryUsersRepository()
		private readonly queryUsersRepository: QueryUsersRepositoryInterface,
		private readonly paginationService: PaginationService,
	) {}

	async execute(command: FindAllUserCommand): Promise<PaginationDto<ResponseUserDto[]>> {
		const searchString = this.queryUsersRepository.searchTerm(
			command.query.searchLoginTerm,
			command.query.searchEmailTerm,
		);

		const totalCount: number = await this.queryUsersRepository.count(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...command.query,
			totalCount,
		});

		const user: UserModel[] = await this.queryUsersRepository.findQuery(
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
			items: user.map((v: UserModel) => ({
				id: v._id.toString(),
				login: v.login,
				email: v.email,
				createdAt: v.createdAt,
				banInfo: {
					isBanned: v.isBanned,
					banDate: v.banDate,
					banReason: v.banReason,
				},
			})),
		};
	}
}
