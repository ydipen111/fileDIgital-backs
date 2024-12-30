
// import { JsonWebTokenError } from "jsonwebtoken";

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

//postB
export const postArchiveController = async (req, res, next) => {



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

