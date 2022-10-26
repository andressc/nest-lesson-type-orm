import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { RecoveryCodeBadRequestException } from '../exceptions/recoveryCodeBadRequestException';

@Injectable()
export class PasswordRecoveryTokenGuard extends AuthGuard('jwt-recovery-password') {
	handleRequest(err: any, user: any, info: JsonWebTokenError, context: any, status: any) {
		if (info instanceof JsonWebTokenError) {
			throw new RecoveryCodeBadRequestException();
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
