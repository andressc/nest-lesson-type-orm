export abstract class MainRepositoryInterface<MODEL, TYPE> {
	abstract create(data: TYPE): Promise<MODEL>;
	abstract find(id: TYPE): Promise<MODEL | null>;
	abstract save(blogModel: MODEL): Promise<MODEL>;
	abstract delete(blogModel: MODEL): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
