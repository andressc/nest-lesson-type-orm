import { ObjectId } from 'mongodb';
import add from 'date-fns/add';

export const blogCreator = (name: string, hours: number, youtubeUrl: string, id?: string) => {
	return {
		_id: !id ? new ObjectId() : id,
		name,
		youtubeUrl,
		createdAt: add(new Date(), {
			hours: hours,
		}),
	};
};
