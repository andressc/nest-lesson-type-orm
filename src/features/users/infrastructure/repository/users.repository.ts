import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserExtendsDto } from '../../dto';
import { User, UserModel } from '../../entity/user.schema';

@Injectable()
export class UsersRepository {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserModel>,
	) {}

	async createUserModel(data: CreateUserExtendsDto): Promise<UserModel> {
		return new this.userModel(data);
	}

	async findUserModel(id: string): Promise<UserModel | null> {
		return this.userModel.findById(id);
	}

	async findUserModelByLogin(login: string): Promise<UserModel | null> {
		return this.userModel.findOne({ login });
	}

	async findUserModelByEmail(email: string): Promise<UserModel | null> {
		return this.userModel.findOne({ email });
	}

	async findUserModelByConfirmationCode(confirmationCode: string): Promise<UserModel | null> {
		return this.userModel.findOne({
			confirmationCode,
		});
	}

	async save(userModel: UserModel): Promise<UserModel> {
		return userModel.save();
	}

	async delete(userModel: UserModel): Promise<void> {
		await userModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.userModel.deleteMany();
	}
}
