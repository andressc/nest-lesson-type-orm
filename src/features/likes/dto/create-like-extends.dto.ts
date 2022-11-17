import { CreateLikeDto } from './create-like.dto';

export class CreateLikeExtendsDto extends CreateLikeDto {
	isBanned: boolean;
	addedAt: string;
}
