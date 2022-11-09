import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { DatabaseModule } from './services/database/database.module';
import { MailerModule } from './services/mailer/mailer.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		FeaturesModule,
		AuthModule,
		UsersModule,
		DatabaseModule,
		MailerModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
