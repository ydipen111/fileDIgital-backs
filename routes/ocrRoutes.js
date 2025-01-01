import express from 'express'
import { ocrController } from '../controllers/ocrController.js';
import { logger } from '../middlewares/logger.js';

const router = express.Router();

router.route('/scan').get(logger, ocrController);

export default router;
