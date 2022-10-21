import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { QueryUsersRepository } from '../../users/api/query/query-users.repository';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly queryUsersRepository: QueryUsersRepository,
	) {}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getProfile(@CurrentUserId() currentUserId) {
		return this.queryUsersRepository.findMe(currentUserId);
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
