import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from '../../../../common/dto';
import { ObjectId } from 'mongodb';
import { MainQueryRepositoryInterface } from '../../interfaces/main.query.repository.interface';

@Injectable()
export class MainQueryRepository<MODEL> implements MainQueryRepositoryInterface<MODEL> {
	protected constructor(private readonly model: Model<MODEL>) {}

	async find(id: ObjectId): Promise<MODEL | null> {
		return this.model.findById(id);
	}

	async findQuery(
		searchString: Record<string, unknown>,
		sortBy: Sort,
		skip: number,
		pageSize: number,
	): Promise<MODEL[] | null> {
		return this.model.find(searchString).sort(sortBy).skip(skip).limit(pageSize);
	}

	async count(searchString): Promise<number> {
		return this.model.countDocuments(searchString);
	}
}
