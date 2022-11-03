import { ObjectId } from 'mongodb';

export const sessionCreator = () => {
	return {
		_id: new ObjectId().toString(),
		ip: 'ip',
		title: 'title',
		lastActiveDate: 'lastActiveDate',
		expirationDate: 'expirationDate',
		deviceId: 'deviceId',
		userId: 'deviceId',
	};
};
