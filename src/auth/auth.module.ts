import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './api/auth.controller';
import { BasicStrategy } from './strategies/basic.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '10m' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, BasicStrategy],
	exports: [AuthService],
})
export class AuthModule {}
