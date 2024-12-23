import express from 'express'
import { archiveOldFile, deleteFile, getFileController, postFileController, updateFileController } from '../controllers/fileController.js';
import { adminCheck, userCheck } from '../middlewares/auth.js';
import { fileCheck, updateFile } from '../middlewares/fileCheck.js';

const router = express.Router();

router.route('/get-file').get(getFileController)
router.route('/post-file').post(userCheck, adminCheck, fileCheck, postFileController)

router.route('/:id').get(getFileController).patch(userCheck, adminCheck, updateFile, updateFileController).delete(deleteFile);

router.route('/old-file').post(archiveOldFile)

export default router;