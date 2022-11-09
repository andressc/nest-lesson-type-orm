import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationEmailResendingDto } from '../../dto';
import { EmailBadRequestException } from '../../../../common/exceptions';
import { UsersRepository } from '../../../users/infrastructure/repository';
import { v4 as uuidv4 } from 'uuid';
import { RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '../../../../services/mailer/application/mailer.service';
import { UserModel } from '../../../users/entity/user.schema';
import { ValidationService } from '../../../application/validation.service';

export class RegistrationEmailResendingAuthCommand {
	constructor(public data: RegistrationEmailResendingDto) {}
}

@CommandHandler(RegistrationEmailResendingAuthCommand)
export class RegistrationEmailResendingAuthHandler
	implements ICommandHandler<RegistrationEmailResendingAuthCommand>
{
	constructor(
		private readonly validationService: ValidationService,
		private readonly usersRepository: UsersRepository,
		private readonly mailerService: MailerService,
	) {}

	async execute(command: RegistrationEmailResendingAuthCommand): Promise<void> {
		await this.validationService.validate(command.data, RegistrationEmailResendingDto);

		const user: UserModel | null = await this.usersRepository.findUserModelByEmail(
			command.data.email,
		);

		if (!user) throw new EmailBadRequestException();
		if (user.isConfirmed) throw new EmailBadRequestException();

		const newConfirmationCode = uuidv4();
		user.updateConfirmationCode(newConfirmationCode);
		await this.usersRepository.save(user);

		try {
			await this.mailerService.sendEmailRegistrationMessage(user.email, user.confirmationCode);

			/*await this.commandBus.execute(
				new SendEmailRegistrationMessageMailerCommand(user.email, user.confirmationCode),
			);*/
		} catch (e) {
			throw new RequestTimeoutException('Message not sent' + e);
		}
	}
}
