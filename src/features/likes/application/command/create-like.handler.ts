import { createDate } from '../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { LikeModel } from '../../domain/like.schema';
import { LikesRepositoryInterface } from '../../interfaces/likes.repository.interface';
import { CreateRequestLikeDto } from '../../../comments/dto';
import { ValidationService } from '../../../../shared/validation/application/validation.service';
import { ObjectId } from 'mongodb';
import { InjectLikesRepository } from '../../infrastructure/providers/likes-repository.provider';

export class CreateLikeCommand implements ICommand {
	constructor(
		public itemId: string,
		public userId: string,
		public userLogin: string,
		public data: CreateRequestLikeDto,
	) {}
}

@CommandHandler(CreateLikeCommand)
export class CreateLikeHandler implements ICommandHandler<CreateLikeCommand> {
	constructor(
		@InjectLikesRepository() private readonly likesRepository: LikesRepositoryInterface,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateLikeCommand): Promise<void> {
		await this.validationService.validate(command.data, CreateRequestLikeDto);

		const like: LikeModel | null = await this.likesRepository.findLikeByItemIdAndUserId(
			new ObjectId(command.itemId),
			new ObjectId(command.userId),
		);

		if (!like) {
			const newLike: LikeModel = await this.likesRepository.create({
				itemId: new ObjectId(command.itemId),
				userId: new ObjectId(command.userId),
				login: command.userLogin,
				likeStatus: command.data.likeStatus,
				isBanned: false,
				addedAt: createDate(),
			});
			await this.likesRepository.save(newLike);
			return;
		}

		like.updateLikeStatus(command.data.likeStatus);
		await this.likesRepository.save(like);
		return;
	}
}
