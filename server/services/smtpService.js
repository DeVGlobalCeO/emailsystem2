import nodemailer from 'nodemailer';

export class SMTPService {
  constructor(config) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendMail({ from, to, subject, html, text }) {
    try {
      const mailOptions = {
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML if text version not provided
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('SMTP send error:', error);
      throw error;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP verification error:', error);
      return false;
    }
  }
}