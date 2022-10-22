import { Body, Controller, Get, HttpCode, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { QueryUsersRepository } from '../../users/api/query/query-users.repository';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RefreshTokenGuard } from '../../common/guards/refreshToken.guard';
import { RefreshToken } from '../../common/decorators/refresh-token.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly queryUsersRepository: QueryUsersRepository,
	) {}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req, @Res({ passthrough: true }) res: Response) {
		const tokens = await this.authService.createTokens(req.user);
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
		@CurrentUserId() currentUserId: string,
		@RefreshToken() refreshToken: string,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokens = await this.authService.refreshToken(currentUserId, refreshToken);
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
	async destroyRefreshToken(@RefreshToken() refreshToken: string) {
		await this.authService.destroyRefreshToken(refreshToken);
	}

	@HttpCode(204)
	@Post('registration')
	async registration(@Body() data: RegistrationDto) {
		await this.authService.registration(data);
	}

	@HttpCode(204)
	@Post('registration-confirmation')
	async registrationConfirmation(@Body() data: RegistrationConfirmationDto) {
		await this.authService.registrationConfirmation(data);
	}

	@HttpCode(204)
	@Post('registration-email-resending')
	async registrationEmailResending(@Body() data: RegistrationEmailResendingDto) {
		await this.authService.registrationEmailResending(data);
	}
}
