import { Request, Response } from 'express';
import { Property } from '../models/property.model';
import { User } from '../models/user.model.js';

export const getPendingProperties = async (req: Request, res: Response) => {
	try {
		const pending = await Property.find({ status: 'pending' }).populate('owner', 'email');
		res.status(200).json(pending);
	} catch (error) {
		res.status(500).json({ message: `erreur lors de la recuperations des annonces ` });
	}
};

export const approveProperty = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const property = await Property.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
		if (!property) return res.status(404).json({ message: 'annonce introuvable' });
		res.status(200).json({ message: 'annonce accepter avec succes ', property });
	} catch (error) {
		res.status(500).json({ message: "errore lors l'acceptations " });
	}
};

export const rejectProperty = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const property = await Property.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
		if (!property) return res.status(404).json({ message: 'Annonce introuvable.' });
		res.status(200).json({ message: 'Annonce rejetée.', property });
	} catch (error) {
		res.status(500).json({ message: 'Erreur lors du rejet.' });
	}
};

export const getReportedProperties = async (req: Request, res: Response) => {
	try {
		const reported = await Property.find({ 'reports.0': { $exists: true } }).populate(
			'reports.user',
			'email'
		);
		res.status(200).json(reported);
	} catch (error) {
		res.status(500).json({ message: 'erreur lors du changement ' });
	}
};

export const getPendingEntreprises = async (req: Request, res: Response) => {
	const entreprises = await User.find({ role: 'entreprise', isValidated: false });
	return res.status(200).json(entreprises);
};

export const validateEntreprise = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = await User.findByIdAndUpdate(id, { isValidated: true }, { new: true });
	if (!user) return res.status(404).json({ message: 'Entreprise not found' });
	return res.status(200).json({ message: 'Entreprise validée', user });
};
