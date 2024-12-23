import jwt from "jsonwebtoken";

export const userCheck = (req, res, next) => {
  const { authorization } = req.headers;

  const decode = jwt.decode(authorization, 'token')



  if (decode) {
    req.id = decode.id;
    req.isAdmin = decode.isAdmin;
    return next()
  } else {
    return res.status(401).json({ message: "Unauthorized" })
  }

}

export const adminCheck = (req, res, next) => {
  if (req.isAdmin) {
    return next();
  } else {
    return res.status(403).json({ message: "you are not authorized" })
  }
}