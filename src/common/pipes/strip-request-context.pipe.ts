import { Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST_CONTEXT } from '../interceptors/inject.Interceptor';
import { omit } from 'lodash';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
	transform(value: any) {
		return omit(value, REQUEST_CONTEXT);
	}
}
