import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationEmailResendingDto } from '../../dto';
import { ValidationService } from '../../../features/application';
import { RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '../../../mailer/application/mailer.service';
import { AuthService } from '../auth.service';

export class PasswordRecoveryAuthCommand {
	constructor(public data: RegistrationEmailResendingDto) {}
}

@CommandHandler(PasswordRecoveryAuthCommand)
export class PasswordRecoveryAuthHandler implements ICommandHandler<PasswordRecoveryAuthCommand> {
	constructor(
		private readonly validationService: ValidationService,
		private readonly mailerService: MailerService,
		private readonly authService: AuthService,
	) {}

	async execute(command: PasswordRecoveryAuthCommand): Promise<void> {
		await this.validationService.validate(command.data, RegistrationEmailResendingDto);

		const recoveryCode: string = await this.authService.createPasswordRecoveryToken(
			command.data.email,
		);

		try {
			await this.mailerService.sendEmailPasswordRecovery(command.data.email, recoveryCode);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}
}
