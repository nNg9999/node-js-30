const config = require('../config.js');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(config.sendGridApiKey)

const { to, from, subject, text, html } = config.emailWebApi;
const msg = {
  to,
  from,
  subject,
  text,
  html,
}

async function mainEmail() {
  const result = await sgMail.send(msg)
  console.log(result);
  console.log('Email sent');
}

module.exports = mainEmail;

