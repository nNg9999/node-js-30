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
    verificationToken: {
      token: createJwtToken(),
      expires: Date.now() + 24 * 60 * 60 * 1000
    }
  });

  const { token } = createdUser.verificationToken;
  const url = `${config.server.endpoint}/auth/verify/${token}`;

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

  const user = await UserModel.findOne({
    "verificationToken.token": verificationToken
  });

  if (!user) {
    logger.error("User not found");
    res.redirect("/error.html");
    throw new ApiError(404, "User not found");

  }

  user.valid = true;
  user.verificationToken = null;
  await user.save();

  res.redirect("/verify.html");
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
