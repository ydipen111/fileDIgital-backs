import mongoose, { mongo } from "mongoose";
import File from "../models/File.js";
import fs from 'fs';




//getALl File
export const getFileController = async (req, res) => {

  try {
    const files = await File.find();
    console.log(files);

    return res.status(200).json({
      message: "getting file data",
      file: files
    })



  } catch (error) {
    return res.status(200).json()

  }
}

//getFileById
export const getFileByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const file = await File.findById(id);
      return res.status(200).json(file)
    } else {
      return res.status(404).json({ message: "file not found" })
    }

  } catch (error) {
    return res.status(400).json({ message: `${error}` })

  }
}



//postFile
export const postFileController = async (req, res, next) => {
  const {
    fileType,
    name,
    description,
    metaData,
    createdAt,
    archived,
    archivedAt,
    isAdmin

  } = req.body;

  // const oneYearAgo = new Date();


  try {

    await File.create({
      fileType: req.fileType,
      name,
      description,
      metaData,
      createdAt,
      archived,
      archivedAt,
      isAdmin

    })
    return res.status(200).json({
      message: "File uploaded succesfull",
    })
  } catch (error) {
    // fs.unlinkSync(`./Uploads/${req.fileType}`)
    return res.status(200).json({ message: `${error}` })

  }
}

//update file
export const updateFileController = async (req, res) => {
  const { id } = req.params;

  const {

    name,
    description,
    metaData,
    createdAt,
    archived,
    archivedAt,
    isAdmin

  } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status.json({ message: 'invalid id' });

    const isExist = await File.findById(id);
    if (!isExist) return res.status(404).json({ message: 'not found' });
    console.log(isExist);


    if (req.newfileType) {
      fs.unlinkSync(`./uploads/${isExist.fileType}`);
      await File.findByIdAndUpdate(
        id,
        {
          name: name || isExist.name,
          description: description || isExist.description,
          metaData: metaData || isExist.metaData,
          fileType: req.newfileType,


        });
    } else {
      await File.findByIdAndUpdate(id,
        {
          name: name || isExist.name,
          description: description || isExist.description,
          metaData: metaData || isExist.metaData,


        })
    }


    return res.status(200).json({ message: "updated file" })


  } catch (error) {
    fs.unlinkSync(`./Uploads/${req.fileType}`);
    return res.status(400).json({ message: `${error}` })

  }

}

//delete file
export const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "File not found" });

    const isExist = await File.findById(id)

    if (!isExist) return res.status(404).json({ message: "File not found" });

    await File.findByIdAndDelete(id);
    fs.unlink(`./Uploads/${isExist.fileType}`, (err) => {
      console.log(err);

    })
    return res.status(200).json({
      message: 'file deleted'
    })
  } catch (error) {
    console.log(error);
    fs.unlinkSync(`./Uploads/${req.fileType}`)
    return res.status(400).json({ message: `${error}` });


  }

}

export const archiveOldFile = async () => {
  const oneYearAgo = new Date();
  // oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  try {
    return res.status(200).json({
      message: "archivedOldFiles"
    })

  } catch (error) {

  }



}