import express from 'express';
import { archiveController } from '../controllers/archiveController.js';

const router = express.Router();

router.route('/getArchiveData').get(archiveController);

export default router;