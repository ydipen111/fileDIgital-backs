import mongoose from 'mongoose';

const ArchivedFileSchema = new mongoose.Schema({
  name: String,
  description: String,
  metaData: String,
  fileType: String,
  createdAt: Date,
  archivedAt: { type: Date, default: Date.now },
  userId: mongoose.Schema.Types.ObjectId,
});

const ArchivedFile = mongoose.models.ArchivedFile || mongoose.model('ArchivedFile', ArchivedFileSchema);

export default ArchivedFile;