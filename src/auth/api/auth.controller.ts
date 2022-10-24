import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { QueryUsersRepository } from '../../users/api/query/query-users.repository';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RefreshTokenGuard } from '../../common/guards/refreshToken.guard';
import { Response } from 'express';
import { RefreshTokenDataDto } from '../dto/refreshTokenData.dto';
import { RefreshTokenData } from '../../common/decorators/refresh-token-data.decorator';
import { CurrentUserIp } from '../../common/decorators/current-user-ip.decorator';
import { CurrentUserAgent } from '../../common/decorators/current-user-agent.decorator';
import { SessionsService } from '../../features/application/sessions.service';
import { ThrottlerProxyGuard } from '../../common/guards/throttler-proxy.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionsService: SessionsService,
		private readonly queryUsersRepository: QueryUsersRepository,
	) {}

	@HttpCode(200)
	@UseGuards(ThrottlerProxyGuard)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@CurrentUserId() currentUserId: string,
		@CurrentUserIp() ip: string,
		@CurrentUserAgent() userAgent: string,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokens = await this.authService.login(currentUserId, ip, userAgent);
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			maxAge: 60 * 1000 * 10,
		});
		return { accessToken: tokens.accessToken };
	}

	@UseGuards(AccessTokenGuard)
	@Get('me')
	async getProfile(@CurrentUserId() currentUserId: string) {
		return this.queryUsersRepository.findMe(currentUserId);
	}

	@HttpCode(200)
	@UseGuards(RefreshTokenGuard)
	@Post('refresh-token')
	async refreshToken(
		@RefreshTokenData() refreshTokenData: RefreshTokenDataDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokens = await this.authService.refreshToken(refreshTokenData);
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			maxAge: 60 * 1000 * 10,
		});
		return { accessToken: tokens.accessToken };
	}

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Post('logout')
	async destroyRefreshToken(@RefreshTokenData() refreshTokenData: RefreshTokenDataDto) {
		await this.sessionsService.removeUserSession(
			refreshTokenData.userId,
			refreshTokenData.deviceId,
		);
	}

	@HttpCode(204)
	@UseGuards(ThrottlerProxyGuard)
	@Post('registration')
	async registration(@Body() data: RegistrationDto) {
		await this.authService.registration(data);
	}

	@HttpCode(204)
	@UseGuards(ThrottlerProxyGuard)
	@Post('registration-confirmation')
	async registrationConfirmation(@Body() data: RegistrationConfirmationDto) {
		await this.authService.registrationConfirmation(data);
	}

	@HttpCode(204)
	@UseGuards(ThrottlerProxyGuard)
	@Post('registration-email-resending')
	async registrationEmailResending(@Body() data: RegistrationEmailResendingDto) {
		await this.authService.registrationEmailResending(data);
	}
}
