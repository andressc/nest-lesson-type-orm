import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { QueryUsersRepository } from '../../users/api/query/query-users.repository';

import { Response } from 'express';
import {
	RefreshTokenDataDto,
	RegistrationConfirmationDto,
	RegistrationDto,
	RegistrationEmailResendingDto,
	NewPasswordDto,
	ResponseTokensDto,
} from '../dto';

import { SessionsService } from '../../features/application';

import {
	CurrentUserAgent,
	CurrentUserId,
	CurrentUserIp,
	RefreshTokenData,
} from '../../common/decorators/Param';
import {
	AccessTokenGuard,
	LocalAuthGuard,
	RateLimitGuard,
	RefreshTokenGuard,
} from '../../common/guards';
import { PasswordRecoveryTokenGuard } from '../../common/guards';
import { AuthConfig } from '../../configuration';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionsService: SessionsService,
		private readonly queryUsersRepository: QueryUsersRepository,
		private readonly authConfig: AuthConfig,
	) {}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@UseGuards(RateLimitGuard)
	@Post('login')
	async login(
		@CurrentUserId() currentUserId: string,
		@CurrentUserIp() ip: string,
		@CurrentUserAgent() userAgent: string,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokens: ResponseTokensDto = await this.authService.login(currentUserId, ip, userAgent);
		res.cookie(
			this.authConfig.getCookieNameJwt(),
			tokens.refreshToken,
			this.authConfig.getCookieSettings(),
		);
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
		@RefreshTokenData()
		refreshTokenData: RefreshTokenDataDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokens = await this.authService.refreshToken(refreshTokenData);
		res.cookie(
			this.authConfig.getCookieNameJwt(),
			tokens.refreshToken,
			this.authConfig.getCookieSettings(),
		);
		return { accessToken: tokens.accessToken };
	}

	@HttpCode(204)
	@UseGuards(RefreshTokenGuard)
	@Post('logout')
	async destroyRefreshToken(
		@RefreshTokenData()
		refreshTokenData: RefreshTokenDataDto,
	) {
		await this.sessionsService.removeUserSession(
			refreshTokenData.userId,
			refreshTokenData.deviceId,
		);
	}

	@HttpCode(204)
	@UseGuards(RateLimitGuard)
	@Post('registration')
	async registration(@Body() data: RegistrationDto) {
		await this.authService.registration(data);
	}

	@HttpCode(204)
	@UseGuards(RateLimitGuard)
	@Post('registration-confirmation')
	async registrationConfirmation(@Body() data: RegistrationConfirmationDto) {
		await this.authService.registrationConfirmation(data);
	}

	@HttpCode(204)
	@UseGuards(RateLimitGuard)
	@Post('registration-email-resending')
	async registrationEmailResending(@Body() data: RegistrationEmailResendingDto) {
		await this.authService.registrationEmailResending(data);
	}

	@HttpCode(204)
	@UseGuards(RateLimitGuard)
	@Post('password-recovery')
	async passwordRecovery(@Body() data: RegistrationEmailResendingDto) {
		await this.authService.passwordRecovery(data);
	}

	@HttpCode(204)
	@UseGuards(PasswordRecoveryTokenGuard)
	@UseGuards(RateLimitGuard)
	@Post('new-password')
	async newPassword(@Body() data: NewPasswordDto, @CurrentUserId() currentUserId: string) {
		await this.authService.newPassword(data, currentUserId);
	}
}
