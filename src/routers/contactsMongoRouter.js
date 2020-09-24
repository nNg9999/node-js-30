const express = require("express");
const router = express.Router();

const joi = require("joi");
const responseNormalizer = require("../normalizers/response-normalizer");
const errorWrapper = require("../helpers/errorWarapper");

const mongodb = require("mongodb");
const connection = require("../database/Connection");

const authCheck = require("../middlewares/auth-check");

router.get("/", authCheck, errorWrapper(async (req, res) => {

  const { page, limit = 10 } = req.query;
  const collection = await connection.database.collection("contacts");
  const contactsList = await collection
    .find({})
    .sort({ name: 1 })
    .skip(limit * page)
    .limit(limit)
    .toArray();

  // res.send({ contacts, count: Math.round(await collection.find({}).count() / limit) });
  res.status(200).send(responseNormalizer(contactsList));

}));

router.get("/:contactId", errorWrapper(async (req, res) => {

  const { contactId } = req.params;
  const collection = await connection.database.collection("contacts");
  const contactById = await collection.findOne({
    _id: mongodb.ObjectId(contactId)
  });

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
      phone: joi.number().min(3),
    })
    .validate(req.body);

  if (error.error) {
    error.error = { message: `${error.error.message} field` };
    return res.status(400).send(responseNormalizer(error.error));
  }

  const collection = connection.getCollection("contacts");
  // const response = await collection.insertOne(req.body); // очень плохо другие могут добавить пользователя с рут правами

  const contactInsert = await collection.insertOne({ name, email, phone });
  // collection.insertMany([{},{},{}]);

  return res.status(201).send(responseNormalizer(contactInsert.ops));

}));


router.delete("/:contactId", errorWrapper(async (req, res) => {

  const { contactId } = req.params;
  const collection = connection.getCollection("contacts");
  const contactToRemove = await collection.findOne({ _id: mongodb.ObjectId(contactId) });

  if (!contactToRemove) {
    const err = { message: "Not found" };
    return res.status(404).send(err);
  }

  await collection.removeOne({ _id: mongodb.ObjectId(contactId) });
  const success = { message: "contact deleted" };
  return res.status(200).send(responseNormalizer(success));

}));

router.patch("/:contactId", errorWrapper(async (req, res) => {

  if (!Object.keys(req.body).length) {
    const err = { message: "missing fields" };
    return res.status(400).send(responseNormalizer(err));
  }

  const { contactId } = req.params;
  const collection = connection.getCollection("contacts");
  const contactToUpdate = await collection.findOne({ _id: mongodb.ObjectId(contactId) });

  if (!contactToUpdate) {
    const err = { message: "Not found" };
    return res.status(404).send(responseNormalizer(err));
  }

  const updateContact = await collection.updateOne(
    { _id: mongodb.ObjectId(contactId) },
    { $set: req.body }
  )

  return res.status(200).send(responseNormalizer(updateContact));

}));


module.exports = router;
