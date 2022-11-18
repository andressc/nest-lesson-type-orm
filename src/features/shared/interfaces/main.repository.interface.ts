export interface MainRepositoryInterface<MODEL, TYPE> {
	create(data: TYPE): Promise<MODEL>;
	find(id: string): Promise<MODEL | null>;
	save(blogModel: MODEL): Promise<MODEL>;
	delete(blogModel: MODEL): Promise<void>;
	deleteAll(): Promise<void>;
}
