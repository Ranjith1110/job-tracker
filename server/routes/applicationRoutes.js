import express from 'express';
import {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for /api/applications
router.route('/')
    .post(protect, createApplication)
    .get(protect, getApplications);

// Routes for /api/applications/:id
router.route('/:id')
    .put(protect, updateApplication)
    .delete(protect, deleteApplication);

export default router;