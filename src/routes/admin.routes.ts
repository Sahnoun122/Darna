import express from 'express';

import {
	getPendingProperties,
	approveProperty,
	rejectProperty,
	getReportedProperties,
} from '../controllers/admin.controller.js';
