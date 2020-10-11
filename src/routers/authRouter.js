const express = require("express");
const router = express.Router();

const joi = require("joi");
const avatarGenerator = require("../helpers/avatarGenerator");
const multer = require("../helpers/multer");
const config = require('../../config');

const passwordHash = require("password-hash");
const authCheck = require("../middlewares/auth-check");
const { validate, ApiError, createJwtToken, validateJwtToken, getLogger } = require("../helpers");

const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");

const UserModel = require("../database/models/UserModel");
const { mailerWebApi } = require('../services');
const logger = getLogger("users-email router");

router.post("/register", errorWrapper(async (req, res) => {

  validate(
    joi.object({
      email: joi.string().min(3).required(),
      password: joi.string().min(3).required(),
    }),
    req.body
  );

  const { email, password } = req.body;
  const size = 200;

  const [user] = await UserModel.find({ email });

  if (user) {
    throw new ApiError(409, "Email in use");
  }

  const avatarURL = await avatarGenerator(email, size);
  const createdUser = await UserModel.create({
    email,
    password,
    avatarURL,
    valid: false,
    verificationToken: createJwtToken()
    // otp: {
    //   token: createJwtToken(),
    //   expires: Date.now() * 60 * 60 * 1000
    //   expires: new Date().getTime()
    // }
  });


  // const url = `${config.server.endpoint}/auth/verify/${createdUser.otp.token}`;
  const url = `${config.server.endpoint}/auth/verify/${createdUser.verificationToken}`;

  await mailerWebApi.sendBody({
    to: email,
    subject: "Verificate you E-mail",
    body: `
      <b>
        <a href="${url}">Click this</a>
      </b>`
  });

  res.status(201).send({ createdUser });

}));


router.get("/verify/:verificationToken", errorWrapper(async (req, res) => {

  const { verificationToken } = req.params;
  // console.log(otp);

  // const user = await UserModel.findOne({
  //   "otp.token": otp
  // });

  const user = await UserModel.findOne({
    verificationToken
  });

  if (!user) {
    logger.error("User not found");
    throw new ApiError(404, "User not found");
    // return res.redirect("/app/error?type=user-not-found");
    // return res.redirect("/error.html");
  }

  user.valid = true
  user.verificationToken = null;
  await user.save();

  // if (user.valid) {
  //   // user.otp = null;
  //   user.verificationToken = null;
  //   await user.save();
  //   return res.redirect("/verify.html");
  // }

  res.redirect("/verify.html");
  // res.redirect("/app/login");
  res.status(200).send();

}));


router.post("/login", errorWrapper(async (req, res) => {

  validate(
    joi.object({
      email: joi.string().min(3).required(),
      password: joi.string().min(3).required(),
    }),
    req.body
  );

  const { email, password } = req.body;

  const [user] = await UserModel.find({ email });

  if (!user) {
    throw new ApiError(401, "Email or password is wrong");
  }

  const isValid = passwordHash.verify(password, user.password);

  if (!isValid) {
    throw new ApiError(401, "Email or password is wrong");
  }

  const token = await user.generateAndSaveToken();

  res.status(201).send({
    id: user._id,
    user: {
      name: user.name,
      email: user.email
    },
    activeToken: token
  });

}));


router.post("/logout", authCheck, errorWrapper(async (req, res) => {

  const { user } = req;
  const activeToken = req.headers["access-token"];

  const findContact = await UserModel.findById(user._id);

  if (!findContact) {
    throw new ApiError(401, "Not autorized");
  }

  user.tokens = user.tokens.filter((tokenRecord) => tokenRecord.token !== activeToken);

  await user.save();

  res.status(204).send();

}));


module.exports = router;
