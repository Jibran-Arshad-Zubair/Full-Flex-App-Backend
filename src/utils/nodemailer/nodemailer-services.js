import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import ejs from 'ejs';

config();

class NodemailerServices {
//   getNodemailerTransporter = async () => {
//     return createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT || '465'),
//       service: process.env.SMTP_SERVICE,
//       auth: {
//         user: process.env.SMTP_MAIL,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });
//   };

  sendEmail = async (options) => {
    const transporter = await this.getNodemailerTransporter();
    try {
      const info = await transporter.sendMail(options);
      return info;
    } catch (error) {
      console.error('Error in sendEmail:', error);
      throw error;
    }
  };

 
  sendEmailToUser = async (data, templatePath, userType = 'user') => {
    try {
      const template = await ejs.renderFile(templatePath, data);
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: data.user_email,
        subject: data.subject,
        html: template,
        cc: data.cc,
      };
      const response = await this.sendEmail(mailOptions);
      console.log(`Email sent to ${userType}: ${data.user_email} with subject: ${data.subject}`);
      return response;
    } catch (error) {
      console.error(`Error in sendEmailTo${userType}: ${error.message}`);
      throw error;
    }
  };

//   sendEmailToAdmin = async (data, templatePath) => {
//     return this.sendEmailToUser(data, templatePath, 'admin');
//   };

//   sendEmailToPartner = async (data, templatePath) => {
//     return this.sendEmailToUser(data, templatePath, 'partner');
//   };

//   sendEmailToMember = async (data, templatePath) => {
//     return this.sendEmailToUser(data, templatePath, 'member');
//   };
}

export const emailService = new NodemailerServices();
