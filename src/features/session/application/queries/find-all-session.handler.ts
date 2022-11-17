import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseSessionDto } from '../../dto/response-session.dto';
import { SessionModel } from '../../entity/session.schema';
import { QuerySessionsRepositoryAdapter } from '../../interfaces/query.sessions.repository.adapter';

export class FindAllSessionCommand {
	constructor(public currentUserId: string) {}
}

@QueryHandler(FindAllSessionCommand)
export class FindAllSessionHandler implements IQueryHandler<FindAllSessionCommand> {
	constructor(private readonly querySessionRepository: QuerySessionsRepositoryAdapter) {}

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
