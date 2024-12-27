import express from 'express'

const router = express.Router();

router.route('/getArchiveData').get((req, res) => {
  return res.status(200).json({ message: "Welcome to archive data" });
})

export default router;