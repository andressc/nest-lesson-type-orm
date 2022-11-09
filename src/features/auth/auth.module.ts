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
import { FeaturesModule } from '../features.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthConfig } from '../../configuration';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '../../services/mailer/mailer.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginAuthHandler } from './application/commands/login-auth.handler';
import { RefreshTokenAuthHandler } from './application/commands/refresh-token-auth.handler';
import { RegistrationAuthHandler } from './application/commands/registration-auth.handler';
import { RegistrationConfirmationAuthHandler } from './application/commands/registration-confirmation-auth.handler';
import { RegistrationEmailResendingAuthHandler } from './application/commands/registration-email-resending-auth.handler';
import { PasswordRecoveryAuthHandler } from './application/commands/password-recovery-auth.handler';
import { NewPasswordAuthHandler } from './application/commands/new-password-auth.handler';
import { ValidateUserAuthHandler } from './application/commands/validate-user-auth.handler';

export const CommandHandlers = [
	LoginAuthHandler,
	RefreshTokenAuthHandler,
	RegistrationAuthHandler,
	RegistrationConfirmationAuthHandler,
	RegistrationEmailResendingAuthHandler,
	PasswordRecoveryAuthHandler,
	NewPasswordAuthHandler,
	ValidateUserAuthHandler,
];
export const QueryHandlers = [];

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
		CqrsModule,
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
		...CommandHandlers,
		...QueryHandlers,
	],
	exports: [AuthService],
})
export class AuthModule {}
