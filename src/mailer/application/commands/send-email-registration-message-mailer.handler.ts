import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MailerAdapter } from '../../infrastructure/adapters/mailer.adapter';

export class SendEmailRegistrationMessageMailerCommand implements ICommand {
	constructor(public email: string, public confirmationCode: string) {}
}

@CommandHandler(SendEmailRegistrationMessageMailerCommand)
export class SendEmailRegistrationMessageMailerHandler
	implements ICommandHandler<SendEmailRegistrationMessageMailerCommand>
{
	constructor(private readonly mailerAdapter: MailerAdapter) {}

	async execute(command: SendEmailRegistrationMessageMailerCommand) {
		return this.mailerAdapter.sendEmail(
			command.email,
			'Confirm email',
			`<a href="https://somesite.com/confirm-email?code=${command.confirmationCode}">link</a>`,
		);
	}
}
