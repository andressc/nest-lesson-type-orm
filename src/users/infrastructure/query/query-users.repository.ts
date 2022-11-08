import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Sort } from '../../../common/dto';
import { User, UserModel } from '../../../database/entity';

@Injectable()
export class QueryUsersRepository {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserModel>,
	) {}

	async findUserModel(id: string): Promise<UserModel | null> {
		return this.userModel.findById(id);
	}

	async findUserQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<UserModel[] | null> {
		return this.userModel.find(searchString).sort(sortBy).skip(skip).limit(pageSize);
	}

	async count(searchString): Promise<number> {
		return this.userModel.countDocuments(searchString);
	}

	public searchTerm = (login: string | undefined, email: string | undefined): any => {
		let searchString = {};

		const searchLoginTerm = login
			? {
					login: { $regex: login, $options: 'i' },
			  }
			: null;
		const searchEmailTerm = email
			? {
					email: { $regex: email, $options: 'i' },
			  }
			: null;

		if (searchLoginTerm) searchString = searchLoginTerm;
		if (searchEmailTerm) searchString = searchEmailTerm;

		if (searchLoginTerm && searchEmailTerm)
			searchString = {
				$or: [searchLoginTerm, searchEmailTerm],
			};

		return searchString;
	};
}
