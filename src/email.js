// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// const path = require('path');
// require('dotenv').config({ path: path.join(process.cwd(), '.env') });
// require('dotenv').config();

const config = require('../config.js');
const sgMail = require('@sendgrid/mail')

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(config.sendGridApiKey)

const msg = {
  to: ['reloader.zhelinskyi@gmail.com', 'mykola.zhelinskyi@gmail.com'], // Change to your recipient
  from: 'mykola.zhelinskyi@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

async function mainEmail() {
  const result = await sgMail.send(msg)
  console.log(result);
  console.log('Email sent');
}

// main()

module.exports = mainEmail;

