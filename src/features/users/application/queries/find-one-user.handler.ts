import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserNotFoundException } from '../../../../common/exceptions';
import { ResponseUserDto } from '../../dto';
import { UserModel } from '../../entity/user.schema';
import { QueryUsersRepositoryInterface } from '../../interface/query.users.repository.interface';

export class FindOneUserCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindOneUserCommand)
export class FindOneUserHandler implements IQueryHandler<FindOneUserCommand> {
	constructor(private readonly queryUsersRepository: QueryUsersRepositoryInterface) {}

	async execute(command: FindOneUserCommand): Promise<ResponseUserDto> {
		const user: UserModel | null = await this.queryUsersRepository.findUserModel(command.id);
		if (!user) throw new UserNotFoundException(command.id);

		return {
			id: user._id,
			login: user.login,
			email: user.email,
			createdAt: user.createdAt,
			banInfo: {
				isBanned: user.isBanned,
				banDate: user.banDate,
				banReason: user.banReason,
			},
		};
	}
}
