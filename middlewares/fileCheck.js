import fs from 'fs';
import path from 'path';

const supportedExts = ['.png', '.jpg', '.webp', '.gif', '.jpeg'];
const supportFileExist = ['.doc', '.docx', '.txt', '.pdf']
// fileCheck for postFile
export const fileCheck = (req, res, next) => {

  // requesting a file
  const file = req.files?.fileType;
  if (!file) {

    return res.status(400).json({ message: "please provide a valid file" });
  }

  // checking the file type
  const Filetype = path.extname(file.name);
  if (![...supportFileExist, ...supportedExts].includes(Filetype)) {
    return res.status(400).json({ message: 'please provide a valid file' });
  }

  //determin where to save the file
  const uploadPath = `./Uploads/${Filetype === '.pdf' || Filetype === '.txt' ? 'files' : 'images'}`;


  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const uniqueName = `${Date.now()}${Filetype}`;

  console.log(uploadPath);


  file.mv(`${uploadPath}/${uniqueName}`, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    req.fileType = `${uniqueName}`;
    next();
  })

  // file.mv(`./Uploads/${file.name}`, (err) => {
  //   if (err) {
  //     console.error("Error moving file:", err.message);
  //     return res.status(400).json({ message: err.message });
  //   }
  //   req.fileType = file.name;
  //   next();

  // });

}

//updateFile for file
export const updateFile = (req, res, next) => {
  const file = req.files?.fileType;
  if (!file) return next();


  const Filetype = path.extname(file.name);
  if (![...supportFileExist, ...supportedExts].includes(Filetype)) return res.status(400).json({ message: 'please provide valid file' });

  const uploadPath = `./Uploads/${Filetype === '.pdf' || Filetype === '.txt' ? 'files' : 'images'}`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const uniqueName = `${Date.now()}${Filetype}`;

  file.mv(`${uploadPath}/${uniqueName}`, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    req.fileType = `${uniqueName}`;
    next();
  })

  // file.mv(`./Uploads/${file.name}`, (err) => {
  //   if (err) return res.status(400).json({ message: err.message });
  //   req.newfileType = file.name;
  //   next();
  // })
}