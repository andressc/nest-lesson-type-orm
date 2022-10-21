import { Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { QueryUsersRepository } from '../../users/api/query/query-users.repository';

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

	/*@HttpCode(204)
	@Post('login')
	async login(@Body() data: LoginDto) {
		return this.authService.login(data);
	}*/
}
