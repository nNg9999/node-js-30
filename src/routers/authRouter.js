const express = require("express");
const router = express.Router();

const joi = require("joi");
const avatarGenerator = require("../helpers/avatarGenerator");
const multer = require("../helpers/multer");

const passwordHash = require("password-hash");
const authCheck = require("../middlewares/auth-check");
const { validate, ApiError } = require("../helpers");

const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");

const UserModel = require("../database/models/UserModel");

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
    avatarURL
  });

  res.status(201).send({ createdUser });

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
