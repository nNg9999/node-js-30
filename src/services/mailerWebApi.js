const nodemailer = require("nodemailer");
const { getLogger } = require("../helpers");
const config = require("../../config");

class MailerWebApi {
  constructor() {
    this.logger = getLogger("mailerWebApi");

    this.transporter = nodemailer.createTransport(
      {
        service: 'gmail', // true for 465, false for other ports
        auth: {
          user: config.nodeMailerUser, // generated ethereal user
          pass: config.nodeMailerPass, // generated ethereal password
        },
      }
    );

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

    return this.transporter.sendMail(
      {
        from: `"Support 👻" ${config.nodeMailerUser}`, // sender address
        // from: config.nodeMailerUser, // sender address
        to: Array.isArray(to) ? to.join(", ") : to, // list of receivers
        subject: subject, // Subject line
        text,
        html
      }
    );
  }

  async sendText({ to, subject, text }) {
    return this.sendMailFromSupport({ to, subject, text });
  }

  async sendBody({ to, subject, body }) {
    return this.sendMailFromSupport({ to, subject, html: body });
  }
}


module.exports = new MailerWebApi();

// mailerWebApi = new MailerWebApi();

// async function main() {

//   await mailerWebApi.init();

//   await mailerWebApi.sendText({
//     to: 'mykola.zhelinskyi@gmail.com',
//     subject: 'INFO',
//     text: 'Server started',
//   })
// }
// main();

