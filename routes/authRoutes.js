import express from "express";
import { loginController, signupController, updateController, userLogout } from "../controllers/userControllers.js";
import Joi from "joi";
import validator from 'express-joi-validation'
import { userCheck } from "../middlewares/auth.js";


const router = express.Router();

const validate = validator.createValidator({});

const signupSchema = Joi.object({
  fullname: Joi.string().min(3).max(25).required(),
  phoneNum: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(25).required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(25).required()
})

router.route('/login').post(validate.body(loginSchema), loginController)
router.route('/signup').post(validate.body(signupSchema), signupController)
router.route('/logout').post(userLogout)
router.route('/update').patch(userCheck, updateController)

export default router;
