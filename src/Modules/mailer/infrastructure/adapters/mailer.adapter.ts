import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { MailerConfig } from '../../../../configuration';

@Injectable()
export class MailerAdapter {
	constructor(private readonly mailerConfig: MailerConfig) {}

	async sendEmail(email: string, subject: string, message: string) {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: this.mailerConfig.getAuth(),
		});

		return await transporter.sendMail({
			from: this.mailerConfig.getAuth().user,
			to: email,
			subject,
			html: message,
		});
	}
}
