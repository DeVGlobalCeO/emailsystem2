import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { promisify } from 'util';

export class IMAPClient {
  constructor(config) {
    this.imap = new Imap({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.secure,
      tlsOptions: { rejectUnauthorized: false }
    });

    // Promisify necessary IMAP methods
    this.connect = promisify(this.imap.connect.bind(this.imap));
    this.openBox = promisify(this.imap.openBox.bind(this.imap));
  }

  async fetchEmails(folder = 'INBOX', limit = 50) {
    try {
      await this.connect();
      await this.openBox(folder);

      return new Promise((resolve, reject) => {
        const emails = [];
        const f = this.imap.seq.fetch(`1:${limit}`, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true
        });

        f.on('message', (msg, seqno) => {
          const email = {
            id: seqno,
            headers: {},
            body: ''
          };

          msg.on('body', async (stream, info) => {
            if (info.which === 'TEXT') {
              const parsed = await simpleParser(stream);
              email.body = parsed.text || parsed.html;
            } else {
              let buffer = '';
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', () => {
                email.headers = Imap.parseHeader(buffer);
              });
            }
          });

          msg.once('end', () => {
            emails.push(email);
          });
        });

        f.once('error', reject);
        f.once('end', () => {
          this.imap.end();
          resolve(emails);
        });
      });
    } catch (error) {
      console.error('IMAP fetch error:', error);
      throw error;
    }
  }

  async moveToSpam(uid) {
    try {
      await this.connect();
      await this.openBox('INBOX');
      
      return new Promise((resolve, reject) => {
        this.imap.move(uid, 'Spam', (err) => {
          if (err) reject(err);
          else resolve();
          this.imap.end();
        });
      });
    } catch (error) {
      console.error('IMAP move error:', error);
      throw error;
    }
  }

  async markAsNotSpam(uid) {
    try {
      await this.connect();
      await this.openBox('Spam');
      
      return new Promise((resolve, reject) => {
        this.imap.move(uid, 'INBOX', (err) => {
          if (err) reject(err);
          else resolve();
          this.imap.end();
        });
      });
    } catch (error) {
      console.error('IMAP move error:', error);
      throw error;
    }
  }
}