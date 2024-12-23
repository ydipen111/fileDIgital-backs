import path from 'path';


const supportedExts = ['.png', '.jpg', '.webp', '.gif', '.jpeg', '.tsx'];


//fileCheck for postFile
export const fileCheck = (req, res, next) => {
  const file = req.files?.fileType;

  if (!file) return res.status(400).json({ message: "please provide a valid file" });

  const type = path.extname(file.name);

  if (!supportedExts.includes(type)) return res.status(400).json({ message: 'please provide a valid file' })

  file.mv(`./Uploads/${file.name}`, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    req.fileType = file.name;
    next();
  })


}

//updateFile for file

export const updateFile = (req, res, next) => {
  const file = req.files?.fileType;
  if (!file) return next();


  const type = path.extname(file.name)

  if (!supportedExts.includes(type)) return res.status(400).json({ message: 'please provide valid file' });

  file.mv(`./Uploads/${file.name}`, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    req.newfileType = file.name;
    next();
  })




}