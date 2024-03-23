const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` 
      user: process.env.EMAIL_SUPORT,
      pass: process.env.EMAIL_SUPORT_PASS
    }
  });

  transporter.verify().then(()=>{
    console.log('READY FOR SEND EMAILS');
  });

  module.exports = {transporter};