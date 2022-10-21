import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';
import { UserModel } from '../../entity/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'login',
		});
	}

	async validate(username: string, password: string): Promise<any> {
		const user: UserModel | null = await this.authService.validateUser(username, password);
		if (!user) throw new UnauthorizedException();

		if (!user.isConfirmed) throw new UnauthorizedException();

		return user;
	}
}
