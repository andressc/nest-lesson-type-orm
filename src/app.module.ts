import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { ThrottlerLimitModule } from './shared/throttler/throttler.module';
import { ValidationModule } from './shared/validation/validation.module';
import { PublicModule } from './features/public/public.module';
import { AuthModule } from './features/public/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		PublicModule,
		AuthModule,
		ThrottlerLimitModule,
		DatabaseModule,
		ValidationModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
