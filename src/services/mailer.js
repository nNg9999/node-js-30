const nodemailer = require("nodemailer");
const { getLogger } = require("../helpers");
const config = require("../../config");

class Mailer {
  constructor() {
    this.logger = getLogger("mailer");

    this.transporter = nodemailer.createTransport(config.mailer);
  }

  async init() {
    this.logger.info("Creating transporter");

    await this.transporter;
  }

  async sendMailFromSupport({ to, subject, text, html }) {
    this.logger.debug("Sending email");
    this.logger.debug("to ->", to);
    this.logger.debug("subject ->", subject);
    text && this.logger.debug("text ->", text);
    html && this.logger.debug("html ->", html);

    return this.transporter.sendMail({
      from: '"Support 👻" <mykola.zhelinskyi@gmail.com>', // sender address

      to: Array.isArray(to) ? to.join(", ") : to, // list of receivers
      subject: subject, // Subject line
      text,
      html
    });
  }

  async sendText({ to, subject, text }) {
    return this.sendMailFromSupport({ to, subject, text });
  }

  async sendBody({ to, subject, body }) {
    return this.sendMailFromSupport({ to, subject, html: body });
  }
}

module.exports = new Mailer();
