import { ConfigService } from '@nestjs/config';

export class BaseConfig {
	constructor(protected configService: ConfigService) {}

	protected getNumberOrThrow(key: string, defaultValue?: number): number {
		let value = Number(this.configService.get(key));

		if (isNaN(value)) value = defaultValue;
		if (value === undefined) throw new Error(`value ${key} not found`);

		return value;
	}

	protected getStringOrThrow(key: string, defaultValue?: string): string {
		let value = this.configService.get(key);

		if (value === undefined || value === '') value = defaultValue;
		if (value === undefined) throw new Error(`.env value ${key} not found`);

		return value;
	}

	protected getBooleanOrThrow(key: string, defaultValue?: boolean): boolean {
		const value = Boolean(this.configService.get(key));

		return value;
	}
}
