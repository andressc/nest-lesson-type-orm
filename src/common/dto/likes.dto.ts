import { LikeStatusEnum } from './like-status.enum';

export class LikesDto {
	userId: string;
	login: string;
	likeStatus: LikeStatusEnum;
	addedAt: string;
}
