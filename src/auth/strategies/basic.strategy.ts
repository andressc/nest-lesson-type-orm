import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfig } from '../../configuration';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authConfig: AuthConfig) {
		super();
	}
	public validate = async (username, password): Promise<boolean> => {
		if (
			username === this.authConfig.getSuperAdminLogin() &&
			password === this.authConfig.getSuperAdminPassword()
		) {
			return true;
		}
		throw new UnauthorizedException(['dvdfvdfg']);
	};
}
