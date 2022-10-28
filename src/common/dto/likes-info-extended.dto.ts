import { LikeStatusEnum } from './like-status.enum';

export class NewestLikes {
	addedAt: string;
	userId: string;
	login: string;
}

export class LikesInfoExtended {
	likesCount: number;
	dislikesCount: number;
	myStatus: LikeStatusEnum;
	newestLikes: NewestLikes[];
}
