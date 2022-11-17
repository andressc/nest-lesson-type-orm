import { MainRepositoryInterface } from './main.repository.interface';
import { ObjectId } from 'mongodb';

export interface BanRepositoryInterface<MODEL, TYPE> extends MainRepositoryInterface<MODEL, TYPE> {
	setBan(userId: ObjectId, isBanned: boolean): Promise<void>;
}
