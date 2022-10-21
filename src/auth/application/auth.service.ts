import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/infrastructure/repository/users.repository';
import { UserModel } from '../../entity/user.schema';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository,
	) {}

	async validateUser(login: string, password: string): Promise<any> {
		const user: UserModel | null = await this.usersRepository.findUserModelByLoginAndPassword(
			login,
			password,
		);

		if (user && user.password === password && user.login === login) {
			return user;
		}

		return null;
	}

	async login(user: any) {
		const payload = { sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	/*async login(data: LoginDto) {
		const user: UserModel | null = await this.usersRepository.findUserModelByLoginAndPassword(
			data.login,
			data.password,
		);

		if (!user || user.password !== data.password || user.login !== data.login)
			throw new UnauthorizedException();

		return null;
	}*/
}
