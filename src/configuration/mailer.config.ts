import { Injectable } from '@nestjs/common';
import { BaseConfig } from './base.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfig extends BaseConfig {
	constructor(configService: ConfigService) {
		super(configService);
	}

	getAuth() {
		return {
			user: this.getStringOrThrow('MAILER_USER'),
			pass: this.getStringOrThrow('MAILER_PASSWORD'),
		};
	}
}
