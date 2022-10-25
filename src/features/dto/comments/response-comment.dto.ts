import { LikeStatusEnum } from './like-status.enum';

export class LikesInfo {
	likesCount: number;
	dislikesCount: number;
	myStatus: LikeStatusEnum;
}

export class ResponseCommentDto {
	id: string;
	content: string;
	userId: string;
	userLogin: string;
	createdAt: string;
	likesInfo: LikesInfo;
}
