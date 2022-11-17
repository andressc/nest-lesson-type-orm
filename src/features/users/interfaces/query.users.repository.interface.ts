import { UserModel } from '../entity/user.schema';
import { MainQueryRepositoryInterface } from '../../interfaces/main.query.repository.interface';

/* eslint-disable */
export interface QueryUsersRepositoryInterface
	extends MainQueryRepositoryInterface<UserModel> {
	searchTerm(login: string | undefined, email: string | undefined): any;
}

/*export abstract class QueryUsersRepositoryInterface {
	abstract findUserModel(id: string): Promise<UserModel | null>;
	abstract findUserQueryModel(
		searchString: any,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<UserModel[] | null>;

	abstract count(searchString): Promise<number>;

	abstract searchTerm(login: string | undefined, email: string | undefined): any;
}*/
