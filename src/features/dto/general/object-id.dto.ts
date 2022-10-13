import { IsMongoId, IsString } from 'class-validator';

export class ObjectIdDto {
	@IsMongoId()
	@IsString()
	id: string;
}
