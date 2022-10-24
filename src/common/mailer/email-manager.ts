import { emailAdapter } from './email-adapter';

export const emailManager = {
	async sendEmailRegistrationMessage(email: string, confirmationCode: string) {
		return emailAdapter.sendEmail(
			email,
			'Confirm email',
			`<a href="https://somesite.com/confirm-email?code=${confirmationCode}">link</a>`,
		);
	},

	async sendEmailPasswordRecovery(email: string, recoveryCode: string) {
		return emailAdapter.sendEmail(
			email,
			'Recovery password',
			`<a href="https://somesite.com/password-recovery?recoveryCode=${recoveryCode}">link</a>`,
		);
	},
};
