import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserExtendsDto } from '../../dto';
import { User, UserModel } from '../../entity/user.schema';
import { UsersRepositoryInterface } from '../../interfaces/users.repository.interface';
import { MainRepository } from '../../../shared/infrastructure/repository/main.repository';

@Injectable()
export class UsersRepository
	extends MainRepository<UserModel, CreateUserExtendsDto>
	implements UsersRepositoryInterface
{
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserModel>,
	) {
		super(userModel);
	}

	async findUserByLogin(login: string): Promise<UserModel | null> {
		return this.userModel.findOne({ login });
	}

	async findUserByEmail(email: string): Promise<UserModel | null> {
		return this.userModel.findOne({ email });
	}

	async findUserByConfirmationCode(confirmationCode: string): Promise<UserModel | null> {
		return this.userModel.findOne({
			confirmationCode,
		});
	}

	/*async create(data: CreateUserExtendsDto): Promise<UserModel> {
		return new this.userModel(data);
	}

	async find(id: string): Promise<UserModel | null> {
		return this.userModel.findById(id);
	}

	async save(userModel: UserModel): Promise<UserModel> {
		return userModel.save();
	}

	async delete(userModel: UserModel): Promise<void> {
		await userModel.delete();
	}

	async deleteAll(): Promise<void> {
		await this.userModel.deleteMany();
	}*/
}
