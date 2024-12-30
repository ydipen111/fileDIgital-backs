import express from 'express'
import { deleteFile, getFileByIdController, getFileByUserIdController, getFileController, postFileController, updateFileController } from '../controllers/fileController.js';
import { adminCheck, userCheck } from '../middlewares/auth.js';
import { fileCheck, updateFile } from '../middlewares/fileCheck.js';

const router = express.Router();

router.route('/get-file').get(getFileController)

// router.route('/userFile').get(getUserFileController);
router.route('/userFile').get(userCheck, getFileByUserIdController)



router.route('/post-file').post(userCheck, adminCheck, fileCheck, postFileController)



router.route('/:id').get(getFileByIdController).patch(userCheck, adminCheck, updateFile, updateFileController).delete(deleteFile);



export default router;