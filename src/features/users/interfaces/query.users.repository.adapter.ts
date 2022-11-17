import { UserModel } from '../entity/user.schema';
import { Sort } from '../../../common/dto';

export abstract class QueryUsersRepositoryAdapter {
	abstract findUserModel(id: string): Promise<UserModel | null>;
	abstract findUserQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<UserModel[] | null>;

	abstract count(searchString): Promise<number>;

	abstract searchTerm(login: string | undefined, email: string | undefined): any;
}
