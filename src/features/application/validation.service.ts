import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationService {
	async validate(data, dto) {
		const entity = plainToInstance(dto, data);
		const errors = await validate(entity);
		const errorsForResponse = [];

		if (errors.length > 0) {
			errors.forEach((e) => {
				const constrainsKeys = Object.keys(e.constraints);

				constrainsKeys.forEach((ckey) => {
					errorsForResponse.push({
						message: e.constraints[ckey],
						field: e.property,
					});
				});
			});
			throw new BadRequestException(errorsForResponse);
		}
	}
}
