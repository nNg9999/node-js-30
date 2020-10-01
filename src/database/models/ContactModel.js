const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const joi = require("joi");
const jsonWebToken = require("jsonwebtoken");
const config = require("../../../config");

const ContactSchema = new mongoose.Schema({
  // email: {
  //   type: String,
  //   validate: {
  //     validator(email) {
  //       const { error } = joi.string().email().validate(email);

  //       if (error) throw new Error("Email not valid");
  //     }
  //   },
  //   required: true
  // },
  // password: { type: String, min: 3, required: true },
  // subscription: {
  //   type: String,
  //   enum: ["free", "pro", "premium"],
  //   default: "free"
  // },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  active: { type: Boolean, default: false },
  tokens: [
    {
      token: { type: String, required: true },
      expires: { type: Date, required: true }
    }
  ],
  createdAt: { type: Date, default: () => Date.now() },
  deletedAt: Date
});

ContactSchema.static("hashPasssword", (password) => {
  return passwordHash.generate(password);
});

ContactSchema.method("isPasswordValid", function (password) {
  return password.verify(password, this.password);
});

ContactSchema.method("generateAndSaveToken", async function () {
  const token = jsonWebToken.sign({ id: this._id }, config.jwtPrivateKey);

  this.tokens.push({
    token,
    expires: new Date().getTime() + 24 * 60 * 60 * 1e3
  });

  await this.save();

  return token;
});

ContactSchema.pre("save", function () {
  if (this.isNew) {
    this.password = this.constructor.hashPasssword(this.password);
  }
});


module.exports = mongoose.model("Contact", ContactSchema);

