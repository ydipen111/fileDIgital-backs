import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  metaData: {
    type: String,
    required: true
  },

  fileType: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  archived: {
    type: Boolean,
    default: false
  },

  archivedAt: {
    type: Date,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false

  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File;