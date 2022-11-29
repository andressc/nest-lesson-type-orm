import { ObjectId } from 'mongodb';

export const banCreator = () => {
	return {
		_id: new ObjectId().toString(),
		userId: 'userId',
		login: 'login',
		blogId: 'blogId',
		blogName: 'blogName',
	};
};
