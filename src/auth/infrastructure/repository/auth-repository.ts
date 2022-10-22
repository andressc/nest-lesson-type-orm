import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenModel } from '../../../entity/refreshToken.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthRepository {
	constructor(
		@InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshTokenModel>,
	) {}

	async createRefreshToken(refreshToken: string): Promise<string> {
		const newToken: RefreshTokenModel = new this.refreshTokenModel({ refreshToken });

		const result = await newToken.save();
		return result.id.toString();
	}

	async findRefreshToken(token: string): Promise<RefreshTokenModel | null> {
		return this.refreshTokenModel.findOne({
			refreshToken: token,
		});
	}

	async deleteAllTokens(): Promise<void> {
		await this.refreshTokenModel.deleteMany({});
	}
}
