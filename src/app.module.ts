import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { CommentsModule } from './features/comments/comments.module';
import { AuthModule } from './features/auth/auth.module';
import { TestingModule } from './features/testing/testing.module';
import { ThrottlerLimitModule } from './shared/throttler/throttler.module';
import { ValidationModule } from './shared/validation/validation.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		CommentsModule,
		AuthModule,
		TestingModule,
		ThrottlerLimitModule,
		DatabaseModule,
		ValidationModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
