import express from "express";
import { loginController, signupController } from "../controllers/userControllers.js";
import Joi from "joi";
import validator from 'express-joi-validation'


const router = express.Router();

const validate = validator.createValidator({});

const signupSchema = Joi.object({
  fullname: Joi.string().min(3).max(25).required(),
  phoneNum: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(25).required()
})

router.route('/login').post(loginController)
router.route('/signup').post(validate.body(signupSchema), signupController)
export default router;
