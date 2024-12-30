import mongoose, { mongo } from "mongoose";
import File from "../models/File.js";
import fs from 'fs';
import jwt from 'jsonwebtoken';
// import { JsonWebTokenError } from "jsonwebtoken";




//getALl File
export const getFileController = async (req, res) => {

  try {

    // helper constants 
    const excludeFields = ['sort', 'search', 'page', 'limit', 'skip', 'fields'];
    const queryObj = { ...req.query };


    // remove unwanted fields
    excludeFields.forEach(field => delete queryObj[field]);

    //handle search
    if (req.query.search) {
      queryObj.name = { $regex: req.query.search, $options: 'i' }
    }

    // handle filtering operations
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`);
    let query = File.find(JSON.parse(queryStr));


    // handle Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;
    const response = await query.skip(skip).limit(limit);


    console.log(response.length);




    return res.status(200).json({
      length: response.length,
      message: "getting file data",
      file: response
    })



  } catch (error) {
    return res.status(200).json()

  }
}

//getFileById
export const getFileByIdController = async (req, res) => {
  const { id } = req.params;
  // const userId = req.user._id;

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

// get file by user
export const getFileByUserIdController = async (req, res) => {
  const userId = req.id;
  console.log(userId);

  try {
    const files = await File.find({ userId: userId });
    console.log(files);

    return res.status(200).json({
      message: 'get file by user',
      files: files

    })

  } catch (error) {

  }
}



//postFile
export const postFileController = async (req, res, next) => {

  // const { id } = req.userId;

  const id = req.id;
  const { authorization } = req.headers;
  // console.log(authorization);
  console.log(id);
  const {
    fileType,
    name,
    description,
    metaData,
    createdAt,
    archived,
    archivedAt,
    isAdmin,
    userId

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
      isAdmin,
      userId: id
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


export const getUserFilesController = async (req, res) => {
  try {
    // const userId = req.user._id; // Assuming user information is available in req.user
    // const files = await File.find({ user: userId });

    return res.status(200).json({
      // length: files.length,
      message: 'Getting user files',
      // files: files
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};