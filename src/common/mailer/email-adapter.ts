import * as nodemailer from 'nodemailer';

export const emailAdapter = {
	async sendEmail(email: string, subject: string, message: string) {
		const transporter = nodemailer.createTransport({
			/*host: 'smtp.mail.ru',
			port: 465,
			secure: true,*/
			service: 'gmail',
			auth: {
				user: 'andrey1rebrov@gmail.com', // generated ethereal user
				pass: 'ymiubsjpplffrmyl', // generated ethereal password
			},
		});

		return await transporter.sendMail({
			from: process.env.emailLogin,
			to: email,
			subject,
			html: message,
		});
	},
};
