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


//login controller
export const loginController = async (req, res) => {

  const { email, password } = req.body;

  try {
    const isExist = await User.findOne({ email: email });
    // console.log(isExist);


    if (isExist) {
      const pass = bcrypt.compareSync(password, isExist.password);
      if (!pass) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({
        id: isExist._id,
        isAdmin: isExist.isAdmin
      }, 'token');

      res.cookie(
        'jwt',
        token,
        {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          sameSite: 'None',
          secure: true
        }
      )



      return res.status(200).json({
        token: token,
        id: isExist._id,
        email: isExist.email,
        isAdmin: isExist.isAdmin,
        message: 'login succesfull'
      })
    } else {
      return res.status(401).json({ message: 'Invalid crendentail' });
    }



  } catch (error) {
    return res.status(400).json({ message: 'errors occurs' })

  }
}

//signup controller
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

//update controller

export const updateController = async (req, res) => {

  const { fullname, phoneNum } = req.body;

  console.log(fullname, phoneNum);

  try {

    const isExist = await User.findById(req.id);
    console.log(isExist);

    if (isExist) {
      isExist.fullname = fullname || isExist.fullname;
      // isExist.password = password || isExist.password;
      isExist.phoneNum = phoneNum || isExist.phoneNum;
      // isExist.email = email || isExist.email;

      await isExist.save();
      return res.status(200).json({ message: 'succesfully update' })
    } else {
      return res.status(404).json({ message: 'User not found' })
    }


  } catch (error) {
    return res.status(400).json({ message: `${error}` })

  }
}

//user logOut

export const userLogout = (req, res) => {

  try {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out succesfully' });
  } catch (error) {
    return res.status(400).json({ message: `${error}` })

  }

}
