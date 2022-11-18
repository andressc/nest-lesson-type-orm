import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LikesRepositoryInterface } from '../../interfaces/likes.repository.interface';
import { Like, LikeModel } from '../../entity/like.schema';
import { CreateLikeExtendsDto } from '../../dto/create-like-extends.dto';
import { ObjectId } from 'mongodb';
import { MainRepository } from '../../../shared/infrastructure/repository/main.repository';

@Injectable()
export class LikesRepository
	extends MainRepository<LikeModel, CreateLikeExtendsDto>
	implements LikesRepositoryInterface
{
	constructor(
		@InjectModel(Like.name)
		private readonly likeModel: Model<LikeModel>,
	) {
		super(likeModel);
	}

	async findLikeByItemIdAndUserId(itemId: ObjectId, userId: ObjectId): Promise<LikeModel> {
		return this.likeModel.findOne({ itemId, userId });
	}

	async setBan(userId: ObjectId, isBanned: boolean): Promise<void> {
		await this.likeModel.updateMany({ userId }, { isBanned });
	}
}
