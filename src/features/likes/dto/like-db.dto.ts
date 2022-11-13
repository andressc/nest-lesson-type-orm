import { LikeStatusEnum } from '../../../common/dto';

export class LikeDbDto {
	type: string;
	login: string;
	userId: string;
	itemId: string;
	likeStatus: LikeStatusEnum;
	addedAt: string;
}
