import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserNotFoundException } from '../../../../common/exceptions';
import { ResponseUserMeDto } from '../../dto';
import { UserModel } from '../../domain/user.schema';
import { QueryUsersRepositoryInterface } from '../../interfaces/query.users.repository.interface';
import { ObjectId } from 'mongodb';
import { InjectQueryUsersRepository } from '../../infrastructure/providers/query-users-repository.provider';

export class FindMeUserCommand {
	constructor(public id: string) {}
}

@QueryHandler(FindMeUserCommand)
export class FindMeUserHandler implements IQueryHandler<FindMeUserCommand> {
	constructor(
		@InjectQueryUsersRepository()
		private readonly queryUsersRepository: QueryUsersRepositoryInterface,
	) {}

	async execute(command: FindMeUserCommand): Promise<ResponseUserMeDto> {
		const user: UserModel | null = await this.queryUsersRepository.find(new ObjectId(command.id));
		if (!user) throw new UserNotFoundException(command.id);

		return {
			email: user.email,
			login: user.login,
			userId: user._id,
		};
	}
}
