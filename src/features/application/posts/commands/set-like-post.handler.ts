import { PostModel } from '../../../../database/entity';
import { PostsRepository } from '../../../infrastructure/repository';
import { ValidationService } from '../../validation.service';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../../dto/comments';
import { PostsService } from '../posts.service';
import { UsersService } from '../../../../users/application/users.service';

export class SetLikePostCommand implements ICommand {
	constructor(public commentId: string, public authUserId: string, public data: CreateLikeDto) {}
}

@CommandHandler(SetLikePostCommand)
export class SetLikePostHandler implements ICommandHandler<SetLikePostCommand> {
	constructor(
		private readonly postsService: PostsService,
		private readonly usersService: UsersService,
		private readonly postsRepository: PostsRepository,
		private readonly validationService: ValidationService,
	) {}

	async execute(command: SetLikePostCommand): Promise<void> {
		await this.validationService.validate(command.data, CreateLikeDto);

		const user = await this.usersService.findUserByIdOrErrorThrow(command.authUserId);

		const post: PostModel = await this.postsService.findPostOrErrorThrow(command.commentId);

		await post.setLike(command.data, command.authUserId, user.login);
		await this.postsRepository.save(post);
	}
}
