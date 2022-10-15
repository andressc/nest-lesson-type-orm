import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export const REQUEST_CONTEXT = '_requestContext';
type Nullable<T> = T | null;

@Injectable()
export class InjectInterceptor implements NestInterceptor {
	constructor(private type?: Nullable<'query' | 'body' | 'param'>) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();

		if (this.type && request[this.type]) {
			request[this.type][REQUEST_CONTEXT] = {
				blogId: request.body.blogId,
			};
		}

		return next.handle();
	}
}
