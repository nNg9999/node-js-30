const express = require("express");
const router = express.Router();

const joi = require('joi');
const authCheck = require("../middlewares/auth-check");
// const multer = require("../helpers/multer");

const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");
const { ApiError, validate, multer: upload } = require("../helpers");

const UserModel = require("../database/models/UserModel");

router.get("/", errorWrapper(async (req, res) => {

  const { page = 0, limit = 20, sub = "free" } = req.query;

  let usersList;
  if (sub) {
    usersList = await UserModel.find({ subscription: `${sub}` })
      .sort({ email: -1 })
  }
  else {
    usersList = await UserModel.find({})
      .sort({ email: -1 })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit));
  }

  res.status(200).send(responseNormalizer(usersList));

}));

router.get("/:userId", errorWrapper(async (req, res) => {

  const { userId } = req.params;

  const userById = await UserModel.findById(userId);

  if (!userById) {
    const err = { message: "Not found" };
    return res.status(404).send(responseNormalizer(err));
  }

  return res.status(200).send(responseNormalizer(userById));

}));

router.post("/", errorWrapper(async (req, res) => {

  const { email, password } = req.body;
  const createdUser = await UserModel.create({ email, password });

  return res.status(201).send(responseNormalizer(createdUser));

}));

router.delete("/:userId", errorWrapper(async (req, res) => {

  const { userId } = req.params;

  const userToRemove = await UserModel.findById(userId);

  if (!userToRemove) {
    const err = { message: "Not found" };
    return res.status(404).send(err);
  }

  await userToRemove.remove();
  const success = { message: "user deleted" };
  return res.status(200).send(responseNormalizer(success));

}));

router.delete("/:userId/soft", errorWrapper(async (req, res) => {

  await UserModel.findByIdAndUpdate(req.params.userId, { deletedAt: new Date() });

  const success = { message: "user deleted soft" };
  return res.status(200).send(responseNormalizer(success));
}));


router.get("/current", authCheck, errorWrapper(async (req, res) => {

  const { _id: id, email, subscription } = req.user;

  return res.status(200).send(responseNormalizer({
    id,
    email,
    subscription,
  }));

}));

router.patch("/current", authCheck, errorWrapper(async (req, res) => {

  if (!Object.keys(req.body).length) {
    const err = { message: "missing fields" };
    return res.status(400).send(responseNormalizer(err));
  }

  validate(
    joi.object({
      subscription: joi.string(),
    }),
    req.body
  );

  const { subscription } = req.body;
  const { _id: userId } = req.user;

  const userToUpdate = await UserModel.findById(userId);

  if (!userToUpdate) {
    throw new ApiError(404, "Not found");
  }

  const subscriptionArray = ["free", "pro", "premium"];

  if (subscription && !subscriptionArray.includes(subscription)) {
    throw new ApiError(400, "Please choose available type of subscription");
  }

  Object.keys(req.body).forEach((key) => {
    userToUpdate[key] = req.body[key];
  });

  const updateUser = await userToUpdate.save();

  res.status(200).send(responseNormalizer(updateUser));

}));

router.patch("/avatar", authCheck, upload.single("avatar"), errorWrapper(async (req, res) => {

  const { email } = req.user;

  if (!email) {
    throw new ApiError(404, "Not authorized");
  }

  const avatarURL = `http://localhost:${process.env.PORT}/images/${req.file.filename}`;

  await UserModel.findByIdAndUpdate(req.id, {
    $set: { avatarURL },
  });

  res.status(200).send(responseNormalizer(avatarURL));
}));

module.exports = router;
