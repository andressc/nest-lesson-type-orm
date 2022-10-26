import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NotAuthorizedGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		if (request.header('authorization')) {
			const [name, token] = request.header('authorization').split(' ');
			const payload = this.jwtService.decode(token);
			request.user = payload.sub;
		}

		return true;
	}
}
