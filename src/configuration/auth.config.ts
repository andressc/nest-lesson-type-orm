import { Injectable } from '@nestjs/common';
import { BaseConfig } from './base.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig extends BaseConfig {
	constructor(configService: ConfigService) {
		super(configService);
	}
	getAccessTokenExpiresIn(): string {
		return this.getStringOrThrow('ACCESS_TOKEN_EXPIRES_IN', '10m');
	}

	getAccessTokenSecret(): string {
		return this.getStringOrThrow('SECRET_ACCESS_TOKEN');
	}

	getRefreshTokenExpiresIn(): string {
		return this.getStringOrThrow('REFRESH_TOKEN_EXPIRES_IN', '20m');
	}

	getRefreshTokenSecret(): string {
		return this.getStringOrThrow('SECRET_REFRESH_TOKEN');
	}

	getRecoveryTokenExpiresIn(): string {
		return this.getStringOrThrow('RECOVERY_TOKEN_EXPIRES_IN', '10m');
	}

	getRecoveryTokenSecret(): string {
		return this.getStringOrThrow('SECRET_RECOVERY_TOKEN');
	}

	getCookieSettings() {
		return {
			httpOnly: this.getBooleanOrThrow('COOKIE_HTTP_ONLY', true),
			secure: this.getBooleanOrThrow('COOKIE_SECURE', true),
			maxAge: this.getNumberOrThrow('COOKIE_MAX_AGE', 600000),
		};
	}

	getCookieNameJwt(): string {
		return this.getStringOrThrow('COOKIE_NAME_JWT', 'refreshToken');
	}

	getSuperAdminLogin(): string {
		return this.getStringOrThrow('SUPER_ADMIN_LOGIN', 'admin');
	}

	getSuperAdminPassword(): string {
		return this.getStringOrThrow('SUPER_ADMIN_PASSWORD', '123456');
	}

	getThrottlerSettings() {
		return {
			ttl: this.getNumberOrThrow('THROTTLER_TTL', 10),
			limit: this.getNumberOrThrow('THROTTLER_LIMIT', 5),
		};
	}
}
