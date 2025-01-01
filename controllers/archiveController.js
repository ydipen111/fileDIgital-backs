import moment from 'moment';
import ArchivedFile from '../models/archivedFile.js';
import File from '../models/file.js';

export const testArchiveData = async (req, res) => {
  try {
    const AD = await File.find({ createdAt: { $lt: moment().subtract(1, 'minutes').toDate() } });
    console.log(AD);

    return res.status(200).json({
      DATA: AD,
      message: "Test Archive Data"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const archiveController = async (req, res) => {
  try {
    await moveOldFiles();
    return res.status(200).json({ message: "Archiving process completed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const moveOldFiles = async () => {
  try {
    // Calculate the timestamp for 1 minute ago
    const oneMinuteAgo = moment().subtract(1, 'minutes').toDate();

    // Find files older than 1 minute
    const oldFiles = await File.find({ createdAt: { $lt: oneMinuteAgo } });

    console.log(`Found ${oldFiles.length} files to archive`);

    // Move files to the archive collection
    for (const file of oldFiles) {
      const archivedFile = new ArchivedFile({
        name: file.name,
        description: file.description,
        metaData: file.metaData,
        fileType: file.fileType,
        createdAt: file.createdAt,
        userId: file.userId,
      });

      await archivedFile.save(); // Save to the archive collection
      await File.deleteOne({ _id: file._id }); // Remove from the original collection

      console.log(`Archived file: ${file.name}`);
    }
  } catch (error) {
    console.error('Error moving old files:', error);
  }
};