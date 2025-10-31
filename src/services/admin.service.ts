import { User } from '../models/user.model.js';
import { Property } from '../models/property.model.js';
import Subscription from '../models/subscription.model.js';

export interface GlobalStats {
	totalUsers: number;
	totalProperties: number;
	totalRevenue: number;
	newUsersThisWeek: number;
	newPropertiesThisWeek: number;
}

export const getGlobalStats = async (): Promise<GlobalStats> => {
	const totalUsers = await User.countDocuments();

	const totalProperties = await Property.countDocuments({ status: 'approved' });

	const totalRevenueData = await Subscription.aggregate([
		{
			$lookup: {
				from: 'plans',
				localField: 'plan',
				foreignField: '_id',
				as: 'planData',
			},
		},
		{ $unwind: '$planData' },
		{
			$group: {
				_id: null,
				totalRevenue: { $sum: '$planData.price' },
			},
		},
	]);

	const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
	const newPropertiesThisWeek = await Property.countDocuments({ createdAt: { $gte: oneWeekAgo } });

	return {
		totalUsers,
		totalProperties,
		totalRevenue,
		newUsersThisWeek,
		newPropertiesThisWeek,
	};
};
