import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationDto } from '../../dto';
import { ConfirmCodeBadRequestException } from '../../../../../common/exceptions';
import { UserModel } from '../../../../admin/users/entity/user.schema';
import { ValidationService } from '../../../../../shared/validation/application/validation.service';
import { UsersRepositoryAdapter } from '../../../../admin/users/adapters/users.repository.adapter';

export class RegistrationConfirmationAuthCommand {
	constructor(public data: RegistrationConfirmationDto) {}
}

@CommandHandler(RegistrationConfirmationAuthCommand)
export class RegistrationConfirmationAuthHandler
	implements ICommandHandler<RegistrationConfirmationAuthCommand>
{
	constructor(
		private readonly validationService: ValidationService,
		private readonly usersRepository: UsersRepositoryAdapter,
	) {}

	async execute(command: RegistrationConfirmationAuthCommand): Promise<void> {
		await this.validationService.validate(command.data, RegistrationConfirmationDto);

		const user: UserModel | null = await this.usersRepository.findUserModelByConfirmationCode(
			command.data.code,
		);

		if (!user) throw new ConfirmCodeBadRequestException();
		if (user.isConfirmed) throw new ConfirmCodeBadRequestException();

		user.updateIsConfirmed(true);
		await this.usersRepository.save(user);
	}
}
