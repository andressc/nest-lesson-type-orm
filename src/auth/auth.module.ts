import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './api/auth.controller';
import { BasicStrategy } from './strategies/basic.strategy';
import { FeaturesModule } from '../features/features.module';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { PasswordRecoveryTokenStrategy } from './strategies/passwordRecoveryToken.strategy';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 10,
			limit: 5,
		}),
		UsersModule,
		PassportModule,
		FeaturesModule,
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		AccessTokenStrategy,
		RefreshTokenStrategy,
		BasicStrategy,
		PasswordRecoveryTokenStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {}
