import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationCalc, PaginationDto } from '../../../common/dto/pagination.dto';
import { ResponseUserDto } from '../../dto/response-user.dto';
import { User, UserModel } from '../../../database/entity/user.schema';
import { UserNotFoundException } from '../../../common/exceptions';
import { PaginationService } from '../../../features/application/pagination.service';
import { QueryUserDto } from '../../dto/query-user.dto';
import { ResponseUserMeDto } from '../../dto/response-user-me.dto';

@Injectable()
export class QueryUsersRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserModel>,
		private readonly paginationService: PaginationService,
	) {}

	async findAllUsers(query: QueryUserDto): Promise<PaginationDto<ResponseUserDto[]>> {
		const searchString = this.searchTerm(query.searchLoginTerm, query.searchEmailTerm);

		const totalCount: number = await this.userModel.countDocuments(searchString);
		const paginationData: PaginationCalc = this.paginationService.pagination({
			...query,
			totalCount,
		});

		const user: UserModel[] = await this.userModel
			.find(searchString)
			.sort(paginationData.sortBy)
			.skip(paginationData.skip)
			.limit(paginationData.pageSize);

		return {
			pagesCount: paginationData.pagesCount,
			page: paginationData.pageNumber,
			pageSize: paginationData.pageSize,
			totalCount: totalCount,
			items: this.mapBlogs(user),
		};
	}

	async findOneUser(id: string): Promise<ResponseUserDto> {
		const user: UserModel | null = await this.userModel.findById(id);
		if (!user) throw new UserNotFoundException(id);

		return {
			id: user._id,
			login: user.login,
			email: user.email,
			createdAt: user.createdAt,
		};
	}

	async findMe(id: string): Promise<ResponseUserMeDto> {
		const user: UserModel | null = await this.userModel.findById(id);
		if (!user) throw new UserNotFoundException(id);

		return {
			email: user.email,
			login: user.login,
			userId: user._id,
		};
	}

	private mapBlogs(user: UserModel[]) {
		return user.map((v: UserModel) => ({
			id: v._id.toString(),
			login: v.login,
			email: v.email,
			createdAt: v.createdAt,
		}));
	}

	private searchTerm = (login: string | undefined, email: string | undefined): any => {
		let searchString = {};

		const searchLoginTerm = login ? { login: { $regex: login, $options: 'i' } } : null;
		const searchEmailTerm = email ? { email: { $regex: email, $options: 'i' } } : null;

		if (searchLoginTerm) searchString = searchLoginTerm;
		if (searchEmailTerm) searchString = searchEmailTerm;

		if (searchLoginTerm && searchEmailTerm)
			searchString = { $or: [searchLoginTerm, searchEmailTerm] };

		return searchString;
	};
}
