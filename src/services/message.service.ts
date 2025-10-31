import Message from '../models/message.model.js';

export const saveMessage = async (sender: string, receiver: string, content: string) => {
	const message = new Message({ sender, receiver, content });
	await message.save();
	return message;
};

export const getMessagesBetweenUsers = async (user1: string, user2: string) => {
	return await Message.find({
		$or: [
			{ sender: user1, receiver: user2 },
			{ sender: user2, receiver: user1 },
		],
	}).sort({ createdAt: 1 });
};
