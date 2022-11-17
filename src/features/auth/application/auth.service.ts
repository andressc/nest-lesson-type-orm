import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseTokensDto } from '../dto';
import { AuthConfig } from '../../../configuration';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private readonly authConfig: AuthConfig) {}

	public async createTokens(userId, deviceId: string): Promise<ResponseTokensDto> {
		return {
			accessToken: this.jwtService.sign(
				{ sub: userId },
				{
					secret: this.authConfig.getAccessTokenSecret(),
					expiresIn: this.authConfig.getAccessTokenExpiresIn(),
				},
			),
			refreshToken: this.jwtService.sign(
				{ sub: userId, deviceId },
				{
					secret: this.authConfig.getRefreshTokenSecret(),
					expiresIn: this.authConfig.getRefreshTokenExpiresIn(),
				},
			),
		};
	}

	public async createPasswordRecoveryToken(email: string): Promise<string> {
		return this.jwtService.sign(
			{ sub: email },
			{
				secret: this.authConfig.getRecoveryTokenSecret(),
				expiresIn: this.authConfig.getRecoveryTokenExpiresIn(),
			},
		);
	}
}
