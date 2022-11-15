import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../../admin/users/users.module';
import { PassportModule } from '@nestjs/passport';
import {
	AccessTokenStrategy,
	LocalStrategy,
	BasicStrategy,
	RefreshTokenStrategy,
	PasswordRecoveryTokenStrategy,
} from './strategies';
import { AuthController } from './api/auth.controller';
import { AuthConfig } from '../../../configuration';
import { MailerModule } from '../../../shared/mailer/mailer.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginAuthHandler } from './application/commands/login-auth.handler';
import { RefreshTokenAuthHandler } from './application/commands/refresh-token-auth.handler';
import { RegistrationAuthHandler } from './application/commands/registration-auth.handler';
import { RegistrationConfirmationAuthHandler } from './application/commands/registration-confirmation-auth.handler';
import { RegistrationEmailResendingAuthHandler } from './application/commands/registration-email-resending-auth.handler';
import { PasswordRecoveryAuthHandler } from './application/commands/password-recovery-auth.handler';
import { NewPasswordAuthHandler } from './application/commands/new-password-auth.handler';
import { ValidateUserAuthHandler } from './application/commands/validate-user-auth.handler';
import { SessionsModule } from '../session/sessions.module';

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

export const Repositories = [];
export const Services = [AuthService, AuthConfig];

export const Strategies = [
	LocalStrategy,
	AccessTokenStrategy,
	RefreshTokenStrategy,
	BasicStrategy,
	PasswordRecoveryTokenStrategy,
];

export const Modules = [
	JwtModule.register({}),
	UsersModule,
	PassportModule,
	SessionsModule,
	MailerModule,
	CqrsModule,
];

@Module({
	imports: [...Modules],
	controllers: [AuthController],
	providers: [...Services, ...Repositories, ...Strategies, ...CommandHandlers, ...QueryHandlers],
	exports: [AuthConfig],
})
export class AuthModule {}
