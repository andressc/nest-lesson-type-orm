import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationEmailResendingDto } from '../../dto';
import { RequestTimeoutException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SendEmailPasswordRecoveryMailerCommand } from '../../../../shared/mailer/application/commands/send-email-password-recovery-mailer.handler';
import { ValidationService } from '../../../../shared/validation/application/validation.service';

export class PasswordRecoveryAuthCommand {
	constructor(public data: RegistrationEmailResendingDto) {}
}

@CommandHandler(PasswordRecoveryAuthCommand)
export class PasswordRecoveryAuthHandler implements ICommandHandler<PasswordRecoveryAuthCommand> {
	constructor(
		private readonly validationService: ValidationService,
		private readonly commandBus: CommandBus,
		private readonly authService: AuthService,
	) {}

	async execute(command: PasswordRecoveryAuthCommand): Promise<void> {
		await this.validationService.validate(command.data, RegistrationEmailResendingDto);

		const recoveryCode: string = await this.authService.createPasswordRecoveryToken(
			command.data.email,
		);

		try {
			await this.commandBus.execute(
				new SendEmailPasswordRecoveryMailerCommand(command.data.email, recoveryCode),
			);
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}
}
