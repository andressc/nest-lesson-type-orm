import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseSessionDto } from '../../dto/response-session.dto';
import { SessionModel } from '../../domain/session.schema';
import { QuerySessionsRepositoryInterface } from '../../interfaces/query.sessions.repository.interface';
import { InjectQuerySessionsRepository } from '../../infrastructure/providers/query-sessions-repository.provider';

export class FindAllSessionCommand {
	constructor(public currentUserId: string) {}
}

@QueryHandler(FindAllSessionCommand)
export class FindAllSessionHandler implements IQueryHandler<FindAllSessionCommand> {
	constructor(
		@InjectQuerySessionsRepository()
		private readonly querySessionRepository: QuerySessionsRepositoryInterface,
	) {}

	async execute(command: FindAllSessionCommand): Promise<ResponseSessionDto[]> {
		const session: SessionModel[] = await this.querySessionRepository.findAllSessionsByUserId(
			command.currentUserId,
		);

		return session.map((v: SessionModel) => ({
			ip: v.ip,
			title: v.title,
			lastActiveDate: v.lastActiveDate,
			deviceId: v.deviceId,
		}));
	}
}
