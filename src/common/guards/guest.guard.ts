import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuestGuard extends AuthGuard('jwt') {
	//handleRequest(err, user, info: JsonWebTokenError, context, status: any) {
	/*if (info?.message === 'No auth token') return user;

		return super.handleRequest(err, user, info, context, status);*/
	handleRequest(err, user) {
		return user;
	}
}
