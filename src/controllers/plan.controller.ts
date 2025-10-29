import { Request, Response } from 'express';
import Plan, { IPlan } from '../models/plan.model';
import Subscription, { ISubscription } from '../models/subscription.model';

export const createPlan = async (req: Request, res: Response) => {
	try {
		const {
			name,
			price,
			currency,
			durationDays,
			features = [],
			active = true,
			metadata = {},
		} = req.body;

		if (!name || typeof price === 'undefined' || !durationDays) {
			return res.status(400).json({ message: 'name, price and durationDays are required.' });
		}

		const plan = await Plan.create({
			name,
			price,
			currency,
			durationDays,
			features,
			active,
			metadata,
		});
		return res.status(201).json({ message: 'Plan created', plan });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
};

export const getAllPlans = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 50, showInactive = false } = req.query;
		const skip = (Number(page) - 1) * Number(limit);
		const query = showInactive === 'true' ? {} : { active: true };
		const [items, total] = await Promise.all([
			Plan.find(query).sort({ price: 1 }).skip(skip).limit(Number(limit)),
			Plan.countDocuments(query),
		]);
		return res.json({ items, total, page: Number(page), limit: Number(limit) });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
};

export const updatePlan = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updated = await Plan.findByIdAndUpdate(id, req.body, { new: true });
		if (!updated) return res.status(404).json({ message: 'Plan not found' });
		return res.json({ message: 'Plan updated', plan: updated });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
};

export const deletePlan = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updated = await Plan.findByIdAndUpdate(id, { active: false }, { new: true });
		if (!updated) return res.status(404).json({ message: 'Plan not found' });
		return res.json({ message: 'Plan deactivated', plan: updated });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
};

export const getSubscriptions = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 50 } = req.query;
		const skip = (Number(page) - 1) * Number(limit);
		const [items, total] = await Promise.all([
			Subscription.find()
				.populate('user', 'email username')
				.populate('plan', 'name price')
				.skip(skip)
				.limit(Number(limit)),
			Subscription.countDocuments(),
		]);
		return res.json({ items, total, page: Number(page), limit: Number(limit) });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
};

export const cancelSubscription = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const sub = await Subscription.findById(id).populate('user plan');
		if (!sub) return res.status(404).json({ message: 'Subscription not found' });

		sub.status = 'cancelled';
		await sub.save();

		return res.json({ message: 'Subscription cancelled', subscription: sub });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
};
