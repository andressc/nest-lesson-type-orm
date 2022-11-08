import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserModel } from '../../../database/entity';
import { QueryUsersRepository } from '../../infrastructure/query/query-users.repository';
import { QueryUserDto, ResponseUserDto } from '../../dto';
import { PaginationService } from '../../../features/application';
import { PaginationCalc, PaginationDto } from '../../../common/dto';

export class FindAllUserCommand {
	constructor(public query: QueryUserDto) {}
}

@QueryHandler(FindAllUserCommand)
export class FindAllUserHandler implements IQueryHandler<FindAllUserCommand> {
	constructor(
		private readonly queryUsersRepository: QueryUsersRepository,
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

		const user: UserModel[] = await this.queryUsersRepository.findUserQueryModel(
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
			})),
		};
	}
}
