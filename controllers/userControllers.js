import { readFile } from 'node:fs/promises'
import path from "node:path";
import { fileURLToPath } from "node:url";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

console.log(_filename);
console.log(_dirname);




export const loginController = async (req, res) => {

  const { email, password } = req.body;

  try {
    const isExist = await User.findOne({ email: email });
    console.log(isExist);


    if (isExist) {
      const pass = bcrypt.compareSync(password, isExist.password);
      if (!pass) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({
        id: isExist._id,
        isAdmin: isExist.isAdmin
      }, 'token');



      return res.status(200).json({
        token: token,
        email: isExist.email,
        isAdmin: isExist.isAdmin,
        message: 'login succesfull'
      })
    } else {
      return res.status(401).json({ message: 'Invalid crendentail' });
    }



  } catch (error) {

  }
}


//login controller
export const signupController = async (req, res) => {
  const { fullname, phoneNum, email, password } = req.body;


  try {

    const isExist = await User.findOne({ email: email });

    if (isExist) return res.status(409).json({ message: 'User already exist' });
    const hash = bcrypt.hashSync(password, 10);

    await User.create({
      fullname: fullname,
      phoneNum: phoneNum,
      email: email,
      password: hash
    })


    return res.status(200).json({ mesage: "signup Succesfull" })
  } catch (error) {

    return res.status(400).json({ message: `${error}` })

  }
}
