const express = require("express");
const router = express.Router();

// const contacts = require("../contacts");

const joi = require("joi");
const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");


router.get("/", errorWrapper(async (req, res) => {
  const contactsList = await contacts.listContacts();
  res.status(200).send(responseNormalizer(contactsList));
}));

router.get("/:contactId", errorWrapper(async (req, res) => {

  const contactById = await contacts.getContactById(
    parseInt(req.params.contactId)
  );

  if (!contactById) {
    const err = { message: "Not found" };
    return res.status(404).send(responseNormalizer(err));
  }

  return res.status(200).send(responseNormalizer(contactById));

}));

router.post("/", errorWrapper(async (req, res) => {

  const { name, email, phone } = req.body;

  const error = joi
    .object({
      name: joi.string().min(3).required(),
      email: joi.string().min(3).required(),
      phone: joi.number().min(3).required(),
    })
    .validate(req.body);

  if (error.error) {
    error.error = { message: `${error.error.message} field` };
    return res.status(400).send(responseNormalizer(error.error));
  }

  const contactToAdd = await contacts.addContact(name, email, phone);
  res.status(201).send(responseNormalizer(contactToAdd));

}));

router.delete("/:contactId", errorWrapper(async (req, res) => {

  const contactToRemove = await contacts.removeContact(
    parseInt(req.params.contactId)
  );

  if (!contactToRemove) {
    const err = { message: "Not found" };
    return res.status(404).send(err);
  }

  const success = { message: "contact deleted" };
  return res.status(200).send(responseNormalizer(success));

}));

router.patch("/:contactId", errorWrapper(async (req, res) => {

  if (!Object.keys(req.body).length) {
    const err = { message: "missing fields" };
    return res.status(400).send(responseNormalizer(err));
  }

  const contactToUpdate = await contacts.updateContact(
    parseInt(req.params.contactId),
    req.body
  );

  if (!contactToUpdate) {
    const err = { message: "Not found" };
    return res.status(404).send(responseNormalizer(err));
  }

  return res.status(200).send(responseNormalizer(contactToUpdate));

}));


module.exports = router;