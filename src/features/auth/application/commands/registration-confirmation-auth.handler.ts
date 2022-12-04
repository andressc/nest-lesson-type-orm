import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationDto } from '../../dto';
import { ConfirmCodeBadRequestException } from '../../../../common/exceptions';
import { UserModel } from '../../../users/domain/user.schema';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { UsersRepositoryInterface } from '../../../users/interfaces/users.repository.interface';
import { InjectUsersRepository } from '../../../users/infrastructure/providers/users-repository.provider';

export class RegistrationConfirmationAuthCommand {
	constructor(public data: RegistrationConfirmationDto) {}
}

@CommandHandler(RegistrationConfirmationAuthCommand)
export class RegistrationConfirmationAuthHandler
	implements ICommandHandler<RegistrationConfirmationAuthCommand>
{
	constructor(
		private readonly validationService: ValidationService,
		@InjectUsersRepository() private readonly usersRepository: UsersRepositoryInterface,
	) {}

	async execute(command: RegistrationConfirmationAuthCommand): Promise<void> {
		await this.validationService.validate(command.data, RegistrationConfirmationDto);

		const user: UserModel | null = await this.usersRepository.findUserByConfirmationCode(
			command.data.code,
		);

		if (!user) throw new ConfirmCodeBadRequestException();
		if (user.isConfirmed) throw new ConfirmCodeBadRequestException();

		user.updateIsConfirmed(true);
		await this.usersRepository.save(user);
	}
}
