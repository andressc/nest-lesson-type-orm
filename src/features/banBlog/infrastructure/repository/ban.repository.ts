import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Ban, BanModel } from '../../entity/ban.schema';
import { LikeModel } from '../../../likes/entity/like.schema';

@Injectable()
export class BanRepository {
	constructor(@InjectModel(Ban.name) private readonly banModel: Model<BanModel>) {}

	async findBanByBlogIdAndUserId(blogId: ObjectId, userId: ObjectId): Promise<LikeModel> {
		return this.banModel.findOne({ blogId, userId });
	}
}
