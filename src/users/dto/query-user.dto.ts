import { QueryDto } from '../../common/dto/query.dto';

export class QueryUserDto extends QueryDto {
	searchLoginTerm?: string;
	searchEmailTerm?: string;
}
