import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserNotFoundException } from '../../../../../common/exceptions';
import { ResponseUserMeDto } from '../../dto';
import { UserModel } from '../../entity/user.schema';
import { QueryUsersRepositoryAdapter } from '../../adapters/query.users.repository.adapter';

export class FindMeUserCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindMeUserCommand)
export class FindMeUserHandler implements IQueryHandler<FindMeUserCommand> {
	constructor(private readonly queryUsersRepository: QueryUsersRepositoryAdapter) {}

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
