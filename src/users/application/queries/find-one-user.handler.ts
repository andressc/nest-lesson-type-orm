import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserModel } from '../../../database/entity';
import { UserNotFoundException } from '../../../common/exceptions';
import { QueryUsersRepository } from '../../infrastructure/query/query-users.repository';
import { ResponseUserDto } from '../../dto';

export class FindOneUserCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindOneUserCommand)
export class FindOneUserHandler implements IQueryHandler<FindOneUserCommand> {
	constructor(private readonly queryUsersRepository: QueryUsersRepository) {}

	async execute(command: FindOneUserCommand): Promise<ResponseUserDto> {
		const user: UserModel | null = await this.queryUsersRepository.findUserModel(command.id);
		if (!user) throw new UserNotFoundException(command.id);

		return {
			id: user._id,
			login: user.login,
			email: user.email,
			createdAt: user.createdAt,
		};
	}
}
