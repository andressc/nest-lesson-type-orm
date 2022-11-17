import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';
import { SessionsRepository } from './infrastructure/repository/sessions.repository';
import { QuerySessionsRepository } from './infrastructure/query/query-sessions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entity/session.schema';
import { FindAllSessionHandler } from './application/queries/find-all-session.handler';
import { RemoveAllUserSessionHandler } from './application/commands/remove-all-user-session.handler';
import { RemoveUserSessionHandler } from './application/commands/remove-user-session.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionInjectionToken } from './application/session.injection.token';

export const CommandHandlers = [RemoveAllUserSessionHandler, RemoveUserSessionHandler];
export const QueryHandlers = [FindAllSessionHandler];
export const Repositories = [
	{
		provide: SessionInjectionToken.QUERY_SESSION_REPOSITORY,
		useClass: QuerySessionsRepository,
	},
	{
		provide: SessionInjectionToken.SESSION_REPOSITORY,
		useClass: SessionsRepository,
	},
];
export const Services = [];

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Session.name,
				schema: SessionSchema,
			},
		]),
		CqrsModule,
	],

	controllers: [SessionsController],
	providers: [...Services, ...Repositories, ...CommandHandlers, ...QueryHandlers],
	exports: [
		{
			provide: SessionInjectionToken.SESSION_REPOSITORY,
			useClass: SessionsRepository,
		},
	],
})
export class SessionsModule {}
