import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	getProfile(@CurrentUserId() currentUserId) {
		return currentUserId;
	}
}
