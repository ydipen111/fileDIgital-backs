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
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false

  }
})

const File = mongoose.model('File', fileSchema);
export default File;