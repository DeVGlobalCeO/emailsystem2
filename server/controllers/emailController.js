import Email from '../models/Email.js';
import { IMAPClient } from '../services/imapService.js';
import { SMTPService } from '../services/smtpService.js';

export const getEmails = async (req, res) => {
  try {
    const { folder = 'inbox' } = req.query;
    const userId = req.user.id;

    const emails = await Email.find({ userId, folder })
      .sort({ date: -1 })
      .limit(50);

    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const smtpService = new SMTPService(user.serverSettings.smtp);
    
    await smtpService.sendMail({
      from: user.email,
      to,
      subject,
      html: body
    });

    // Save to sent folder
    await Email.create({
      userId,
      messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      folder: 'sent',
      from: user.email,
      to,
      subject,
      body,
      date: new Date()
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStar = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.id;

    const email = await Email.findOne({ _id: emailId, userId });
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    email.starred = !email.starred;
    await email.save();

    res.json({ starred: email.starred });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};