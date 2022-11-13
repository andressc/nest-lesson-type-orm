import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LikesRepositoryAdapter } from '../../adapters/likes.repository.adapter';
import { Like, LikeModel } from '../../entity/like.schema';
import { CreateLikeExtendsDto } from '../../dto/create-like-extends.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class LikesRepository implements LikesRepositoryAdapter {
	constructor(
		@InjectModel(Like.name)
		private readonly likeModel: Model<LikeModel>,
	) {}

	async createLikeModel(data: CreateLikeExtendsDto): Promise<LikeModel> {
		return new this.likeModel(data);
	}

	async findLikeModelByItemIdAndUserId(itemId: ObjectId, userId: ObjectId): Promise<LikeModel> {
		return this.likeModel.findOne({ itemId, userId });
	}

	async save(likeModel: LikeModel): Promise<LikeModel> {
		return likeModel.save();
	}

	async deleteAll(): Promise<void> {
		await this.likeModel.deleteMany();
	}
}
