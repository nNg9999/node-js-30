const express = require("express");
const router = express.Router();

const joi = require('joi');
const authCheck = require("../middlewares/auth-check");

const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");
const { ApiError, validate } = require("../helpers");

const UserModel = require("../database/models/UserModel");


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
  const { _id: contactId } = req.user;

  const contactToUpdate = await UserModel.findById(contactId);

  if (!contactToUpdate) {
    throw new ApiError(404, "Not found");
  }

  const subscriptionArray = ["free", "pro", "premium"];

  if (subscription && !subscriptionArray.includes(subscription)) {
    throw new ApiError(400, "Please choose available type of subscription");
  }

  Object.keys(req.body).forEach((key) => {
    contactToUpdate[key] = req.body[key];
  });

  const updateContact = await contactToUpdate.save();

  res.status(200).send(responseNormalizer(updateContact));

}));

module.exports = router;
