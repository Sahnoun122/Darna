import { Request, Response } from 'express';
import { Property } from '../models/property.model';

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
