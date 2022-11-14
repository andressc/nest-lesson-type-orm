import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
	/*async handleRequest(context: ExecutionContext, limit: number, ttl: number) {

		return true;
	}*/

	protected getTracker(req: Record<string, any>): string {
		return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
	}
}
