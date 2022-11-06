export abstract class RepositoryInterface<MODEL, DTO> {
	abstract createModel(data: DTO): Promise<MODEL>;
	abstract findModel(id: string): Promise<MODEL | null>;
	abstract save(model: MODEL): Promise<MODEL>;
	abstract delete(model: MODEL): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
