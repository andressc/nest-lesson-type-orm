import { LikesInfoExtended } from '../../../../common/dto';

export class ResponsePostDto {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: string;
	extendedLikesInfo: LikesInfoExtended;
}
