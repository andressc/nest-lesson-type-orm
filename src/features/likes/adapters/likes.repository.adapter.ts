import { LikeModel } from '../entity/like.schema';
import { CreateLikeExtendsDto } from '../dto/create-like-extends.dto';
import { ObjectId } from 'mongodb';

export abstract class LikesRepositoryAdapter {
	abstract createLikeModel(data: CreateLikeExtendsDto): Promise<LikeModel>;
	abstract findLikeModelByItemIdAndUserId(itemId: ObjectId, userId: ObjectId): Promise<LikeModel>;
	abstract save(likeModel: LikeModel): Promise<LikeModel>;
	abstract deleteAll(): Promise<void>;
}
