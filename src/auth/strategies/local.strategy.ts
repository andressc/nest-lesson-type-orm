import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';
import { UserModel } from '../../database/entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'login',
		});
	}

	async validate(username: string, password: string) {
		const user: UserModel | null = await this.authService.validateUser(username, password);
		if (!user) throw new UnauthorizedException();

		if (!user.isConfirmed) throw new UnauthorizedException();

		return { userId: user._id };
	}
}
