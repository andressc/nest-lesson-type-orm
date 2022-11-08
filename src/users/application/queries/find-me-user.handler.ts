import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserModel } from '../../../database/entity';
import { UserNotFoundException } from '../../../common/exceptions';
import { QueryUsersRepository } from '../../infrastructure/query/query-users.repository';
import { ResponseUserMeDto } from '../../dto';

export class FindMeUserCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindMeUserCommand)
export class FindMeUserHandler implements IQueryHandler<FindMeUserCommand> {
	constructor(private readonly queryUsersRepository: QueryUsersRepository) {}

	async execute(command: FindMeUserCommand): Promise<ResponseUserMeDto> {
		const user: UserModel | null = await this.queryUsersRepository.findUserModel(command.id);
		if (!user) throw new UserNotFoundException(command.id);

		return {
			email: user.email,
			login: user.login,
			userId: user._id,
		};
	}
}
