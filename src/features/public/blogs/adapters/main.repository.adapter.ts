export abstract class MainRepositoryAdapter<MODEL, TYPE> {
	abstract create(data: TYPE): Promise<MODEL>;
	abstract find(id: string): Promise<MODEL | null>;
	abstract save(blogModel: MODEL): Promise<MODEL>;
	abstract delete(blogModel: MODEL): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
