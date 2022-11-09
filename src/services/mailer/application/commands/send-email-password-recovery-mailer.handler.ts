import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MailerAdapter } from '../../infrastructure/adapters/mailer.adapter';

export class SendEmailPasswordRecoveryMailerCommand implements ICommand {
	constructor(public email: string, public recoveryCode: string) {}
}

@CommandHandler(SendEmailPasswordRecoveryMailerCommand)
export class SendEmailPasswordRecoveryMailerHandler
	implements ICommandHandler<SendEmailPasswordRecoveryMailerCommand>
{
	constructor(private readonly mailerAdapter: MailerAdapter) {}

	async execute(command: SendEmailPasswordRecoveryMailerCommand) {
		return this.mailerAdapter.sendEmail(
			command.email,
			'Recovery password',
			`<a href="https://somesite.com/password-recovery?recoveryCode=${command.recoveryCode}">link</a>`,
		);
	}
}
