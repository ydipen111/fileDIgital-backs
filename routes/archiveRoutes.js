import express from 'express';
import { archiveController, testArchiveData } from '../controllers/archiveController.js';
import { getArchiveControllerData } from '../controllers/fileController.js';

const router = express.Router();

router.route('/getArchive').get(archiveController);
router.route('/getArchiveData').get(getArchiveControllerData);

export default router;