import { Injectable } from '@nestjs/common';
import { MailerAdapter } from '../infrastructure/adapters/mailer.adapter';

@Injectable()
export class MailerService {
	constructor(private readonly mailerAdapter: MailerAdapter) {}

	async sendEmailRegistrationMessage(email: string, confirmationCode: string) {
		return this.mailerAdapter.sendEmail(
			email,
			'Confirm email',
			`<a href="https://somesite.com/confirm-email?code=${confirmationCode}">link</a>`,
		);
	}

	async sendEmailPasswordRecovery(email: string, recoveryCode: string) {
		return this.mailerAdapter.sendEmail(
			email,
			'Recovery password',
			`<a href="https://somesite.com/password-recovery?recoveryCode=${recoveryCode}">link</a>`,
		);
	}
}
