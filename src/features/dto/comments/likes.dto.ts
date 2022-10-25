import { LikeStatusEnum } from './like-status.enum';

export class LikesDto {
	userId: string;
	likeStatus: LikeStatusEnum;
}
