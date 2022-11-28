export class ResponseBannedBlogOfUserDto {
	id: string;
	login: string;
	banInfo: {
		isBanned: boolean;
		banDate: string;
		banReason: string;
	};
}
