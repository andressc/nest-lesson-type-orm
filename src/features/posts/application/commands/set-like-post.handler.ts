import { PostModel } from '../../entity/post.schema';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../../comments/dto';
import { PostsService } from '../posts.service';
import { UsersService } from '../../../users/application/users.service';
import { ValidationService } from '../../../application/validation.service';
import { PostsRepositoryInterface } from '../../interface/posts.repository.interface';

export class SetLikePostCommand implements ICommand {
	constructor(public commentId: string, public authUserId: string, public data: CreateLikeDto) {}
}

@CommandHandler(SetLikePostCommand)
export class SetLikePostHandler implements ICommandHandler<SetLikePostCommand> {
	constructor(
		private readonly postsService: PostsService,
		private readonly usersService: UsersService,
		private readonly postsRepository: PostsRepositoryInterface,
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
