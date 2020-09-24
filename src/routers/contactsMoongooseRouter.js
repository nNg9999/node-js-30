const express = require("express");
const router = express.Router();
const joi = require("joi");

const { ApiError } = require("../helpers");

const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");
const validate = require("../helpers/validate");

const UserModel = require("../database/models/UserModel");


router.get("/", errorWrapper(async (req, res) => {

  const { page = 0, limit = 20, sub = "free" } = req.query;

  let contactsList;
  if (sub) {
    contactsList = await UserModel.find({ subscription: `${sub}` })
      .sort({ email: -1 })
  }
  else {
    contactsList = await UserModel.find({})
      .sort({ email: -1 })
      .skip(parseInt(page * limit))
      .limit(parseInt(limit));
  }

  res.status(200).send(responseNormalizer(contactsList));

}));

router.get("/:contactId", errorWrapper(async (req, res) => {

  const { contactId } = req.params;

  const contactById = await UserModel.findById(contactId);

  if (!contactById) {
    const err = { message: "Not found" };
    return res.status(404).send(responseNormalizer(err));
  }

  return res.status(200).send(responseNormalizer(contactById));

}));

router.post("/", errorWrapper(async (req, res) => {

  const { email, password } = req.body;
  const createdUser = await UserModel.create({ email, password });

  return res.status(201).send(responseNormalizer(createdUser));

}));

router.delete("/:contactId", errorWrapper(async (req, res) => {

  const { contactId } = req.params;

  const contactToRemove = await UserModel.findById(contactId);

  if (!contactToRemove) {
    const err = { message: "Not found" };
    return res.status(404).send(err);
  }

  await contactToRemove.remove();
  const success = { message: "contact deleted" };
  return res.status(200).send(responseNormalizer(success));

}));

router.delete("/:contactId/soft", errorWrapper(async (req, res) => {

  await UserModel.findByIdAndUpdate(req.params.contactId, { deletedAt: new Date() });

  const success = { message: "contact deleted soft" };
  return res.status(200).send(responseNormalizer(success));
}));

router.patch("/:contactId", errorWrapper(async (req, res) => {

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

  const { contactId } = req.params;

  const contactToUpdate = await UserModel.findById(contactId);

  if (!contactToUpdate) {
    throw new ApiError(404, "Not found");
  }

  Object.keys(req.body).forEach((key) => {
    contactToUpdate[key] = req.body[key];
  });

  const updateContact = await contactToUpdate.save();

  res.status(200).send(responseNormalizer(updateContact));
}));


module.exports = router;
