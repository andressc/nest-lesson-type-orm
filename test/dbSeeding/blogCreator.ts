import { ObjectId } from 'mongodb';
import add from 'date-fns/add';

export const blogCreator = (
	name: string,
	hours: number,
	websiteUrl: string,
	id?: string,
	userId?: string,
) => {
	return {
		_id: !id ? new ObjectId() : id,
		name,
		description: 'description',
		websiteUrl,
		userId: !userId ? new ObjectId().toString() : userId,
		userLogin: 'userLogin',
		createdAt: add(new Date(), {
			hours: hours,
		}),
	};
};
