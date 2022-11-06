import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import {
	AccessTokenStrategy,
	LocalStrategy,
	BasicStrategy,
	RefreshTokenStrategy,
	PasswordRecoveryTokenStrategy,
} from './strategies';
import { AuthController } from './api/auth.controller';
import { FeaturesModule } from '../features/features.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthConfig } from '../configuration';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '../mailer/mailer.module';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			useFactory: async (configService: ConfigService) => {
				return {
					ttl: Number(configService.get<string>('THROTTLER_TTL')),
					limit: Number(configService.get<string>('THROTTLER_LIMIT')),
				};
			},
			inject: [ConfigService],
		}),
		JwtModule.register({}),
		UsersModule,
		PassportModule,
		FeaturesModule,
		MailerModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		AccessTokenStrategy,
		RefreshTokenStrategy,
		BasicStrategy,
		PasswordRecoveryTokenStrategy,
		AuthConfig,
	],
	exports: [AuthService],
})
export class AuthModule {}
