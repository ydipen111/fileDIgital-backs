// import connectDB from './db.js';
// import { moveOldFiles } from './services/archiveService.js';

import connectDB from "./db";
import { moveOldFiles } from "./services/archiveService";

const runArchiveProcess = async () => {
  await connectDB();
  await moveOldFiles();
  mongoose.connection.close();
  console.log('Archiving process completed');
};

runArchiveProcess();