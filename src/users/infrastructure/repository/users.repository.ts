import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '../../../entity/user.schema';
import { CreateUserExtendsDto } from '../../dto/create-user-extends.dto';

@Injectable()
export class UsersRepository {
	constructor(@InjectModel(User.name) private readonly userModel: Model<UserModel>) {}

	async createUser(data: CreateUserExtendsDto): Promise<string> {
		const newUser: UserModel = new this.userModel(data);

		const result = await newUser.save();
		return result.id.toString();
	}

	async removeUser(user: UserModel): Promise<void> {
		await user.delete();
	}

	async deleteAll(): Promise<void> {
		await this.userModel.deleteMany();
	}

	async findUserModel(id: string): Promise<UserModel | null> {
		return this.userModel.findById(id);
	}

	async findUserModelByEmailOrLogin(login: string, email: string): Promise<UserModel | null> {
		return this.userModel.findOne({ $or: [{ login }, { email }] });
	}

	async findUserModelByLogin(login: string): Promise<UserModel | null> {
		return this.userModel.findOne({ login });
	}

	async findUserModelByEmail(email: string): Promise<UserModel | null> {
		return this.userModel.findOne({ email });
	}

	async findUserModelByConfirmationCode(confirmationCode: string): Promise<UserModel | null> {
		return this.userModel.findOne({ confirmationCode });
	}

	async updateIsConfirmed(user: UserModel): Promise<void> {
		await user.updateIsConfirmed(true).save();
	}

	async updateConfirmationCode(user, ConfirmationCode: string): Promise<void> {
		await user.updateConfirmationCode(ConfirmationCode).save();
	}
}
