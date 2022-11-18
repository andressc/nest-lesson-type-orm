import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MainRepositoryInterface } from '../../interfaces/main.repository.interface';

@Injectable()
export abstract class MainRepository<MODEL, TYPE> implements MainRepositoryInterface<MODEL, TYPE> {
	protected constructor(private readonly model: Model<MODEL>) {}

	async create(data: TYPE): Promise<MODEL> {
		return new this.model(data);
	}

	async find(id: string): Promise<MODEL | null> {
		return this.model.findById(id);
	}

	async save(model: any): Promise<MODEL> {
		return model.save();
	}

	async delete(model: any): Promise<void> {
		await model.delete();
	}

	async deleteAll(): Promise<void> {
		await this.model.deleteMany();
	}
}
