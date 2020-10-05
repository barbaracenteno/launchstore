const nodemailer = require('nodemailer')

module.exports =  transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cf7c62b128779d",
      pass: "ecb0494c32715d"
    }
  });
