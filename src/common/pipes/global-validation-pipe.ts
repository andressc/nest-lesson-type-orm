import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const globalValidationPipe = () => {
	return new ValidationPipe({
		stopAtFirstError: true,
		transform: true,
		exceptionFactory: (errors) => {
			const errorsForResponse = [];

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
		},
	});
};
