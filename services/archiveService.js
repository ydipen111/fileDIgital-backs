import moment from 'moment';
import File from '../models/file.js';
import ArchivedFile from '../models/archivedFile.js';

export const moveOldFiles = async () => {
  try {
    const oneMinuteAgo = moment().subtract(1, 'minutes').toDate();
    const oldFiles = await File.find({ createdAt: { $lt: oneMinuteAgo } });

    console.log(`Found ${oldFiles.length} files to archive`);

    for (const file of oldFiles) {
      const archivedFile = new ArchivedFile({
        name: file.name,
        description: file.description,
        metaData: file.metaData,
        fileType: file.fileType,
        createdAt: file.createdAt,
        userId: file.userId,
      });

      await archivedFile.save();
      await File.deleteOne({ _id: file._id });

      console.log(`Archived file: ${file.name}`);
    }
  } catch (error) {
    console.error('Error moving old files:', error);
  }
};