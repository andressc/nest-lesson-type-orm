export interface MainRepositoryInterface<MODEL, TYPE> {
	create(data: TYPE): Promise<MODEL>;
	find(id: string): Promise<MODEL | null>;
	save(model: MODEL): Promise<MODEL>;
	delete(model: MODEL): Promise<void>;
	deleteAll(): Promise<void>;
}
