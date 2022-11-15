import { createDate } from '../../../../../common/helpers';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { LikeModel } from '../../entity/like.schema';
import { LikesRepositoryAdapter } from '../../adapters/likes.repository.adapter';
import { CreateRequestLikeDto } from '../../../comments/dto';
import { ValidationService } from '../../../../../shared/validation/application/validation.service';
import { ObjectId } from 'mongodb';

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
		private readonly likesRepository: LikesRepositoryAdapter,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: CreateLikeCommand): Promise<void> {
		await this.validationService.validate(command.data, CreateRequestLikeDto);

		const like: LikeModel | null = await this.likesRepository.findLikeModelByItemIdAndUserId(
			new ObjectId(command.itemId),
			new ObjectId(command.userId),
		);

		if (!like) {
			const newLike: LikeModel = await this.likesRepository.createLikeModel({
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
