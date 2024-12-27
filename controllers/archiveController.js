const moment = require('moment');
const mongoose = require('mongoose');

const setupMongoConnection = async (uri) => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

const processDocumentMove = async (document, destDB, destCollection) => {
  try {
    const destCollectionCol = destDB.collection(destCollection);
    await destCollectionCol.updateOne({ _id: document._id }, { $set: document }, { upsert: true });
  } catch (e) {
    console.log(`Failed to upsert ${document._id} to the archive DB`, e);
    return false;
  }
  return true;
};

const processSingularSource = async (srcDB, destDB, archiveSource) => {
  const { database, collection, field, archiveDays, destCollection } = archiveSource;

  const srcCol = srcDB.collection(collection);
  const destCol = destDB.collection(destCollection);

  const archiveBeforeTS = moment().subtract(archiveDays, 'days').toDate();
  const olderDocuments = await srcCol.find({ [field]: { $lt: archiveBeforeTS } }).toArray();
  console.log(`Found ${olderDocuments.length} to archive`);
  if (olderDocuments.length == 0) {
    return;
  }

  const executors = [...new Array(1)];
  let i = 0;
  await Promise.all(executors.map(async () => {
    do {
      const document = olderDocuments[i];
      i++;

      const moveOk = await processDocumentMove(document, destDB, destCollection);
      if (moveOk) {
        console.log(`Move OK; Removing document ${document._id} from source collection`);
        await srcCol.deleteOne(document);
      } else {
        console.log(`Move failed, not processing any more documents`);
        return;
      }
    } while (i < olderDocuments.length);
  }));
};

const processArchiving = async (srcDB, destDB, archiveSources) => {
  const executors = [...new Array(Math.min(5, archiveSources.length))];
  let i = 0;
  await Promise.all(executors.map(async () => {
    do {
      const archiveSource = archiveSources[i];
      i++;

      await processSingularSource(srcDB, destDB, archiveSource);
    } while (i < archiveSources.length);
  }));
};

const archiveData = async (uri, archiveSources) => {
  const srcDB = mongoose.connection.useDb('sourceCluster');
  const destDB = mongoose.connection.useDb('destinationCluster');

  await processArchiving(srcDB, destDB, archiveSources);

  console.log('Archiving process completed');
};

module.exports = { setupMongoConnection, archiveData };

const { setupMongoConnection, archiveData } = require('./archiveController');

const uri = 'your-mongodb-uri';
const archiveSources = [
  {
    database: 'yourDatabase',
    collection: 'yourCollection',
    field: 'createdAt', // Field to check the date
    archiveDays: 30, // Archive data older than 30 days
    destCollection: 'archivedCollection'
  }
];

const runArchive = async () => {
  await setupMongoConnection(uri);
  await archiveData(uri, archiveSources);
};

runArchive();