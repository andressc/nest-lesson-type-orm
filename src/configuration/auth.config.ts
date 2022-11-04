import { Injectable } from '@nestjs/common';
import { BaseConfig } from './base.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig extends BaseConfig {
	constructor(configService: ConfigService) {
		super(configService);
	}
	getAccessTokenExpiresIn() {
		return this.getStringOrThrow('ACCESS_TOKEN_EXPIRES_IN', '10m');
	}

	getAccessTokenSecret() {
		return this.getStringOrThrow('SECRET_ACCESS_TOKEN');
	}

	getRefreshTokenExpiresIn() {
		return this.getStringOrThrow('REFRESH_TOKEN_EXPIRES_IN', '20m');
	}

	getRefreshTokenSecret() {
		return this.getStringOrThrow('SECRET_REFRESH_TOKEN');
	}

	getRecoveryTokenExpiresIn() {
		return this.getStringOrThrow('RECOVERY_TOKEN_EXPIRES_IN', '10m');
	}

	getRecoveryTokenSecret() {
		return this.getStringOrThrow('SECRET_RECOVERY_TOKEN');
	}

	getCookieSettings() {
		return {
			httpOnly: this.getBooleanOrThrow('COOKIE_HTTP_ONLY', true),
			secure: this.getBooleanOrThrow('COOKIE_SECURE', true),
			maxAge: this.getNumberOrThrow('COOKIE_MAX_AGE', 600000),
		};
	}

	getCookieNameJwt() {
		return this.getStringOrThrow('COOKIE_NAME_JWT', 'refreshToken');
	}

	getThrottlerSettings() {
		return {
			ttl: this.getNumberOrThrow('THROTTLER_TTL', 10),
			limit: this.getNumberOrThrow('THROTTLER_LIMIT', 5),
		};
	}
}
