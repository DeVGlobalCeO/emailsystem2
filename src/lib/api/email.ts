import { EmailFolder, Email, Label } from '../../types/email';
import { SpamClassifier } from '../email/SpamClassifier';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
}

export default class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async getEmails(folder: EmailFolder): Promise<Email[]> {
    try {
      // Fetch emails from CyberPanel API
      const response = await fetch(`https://${this.config.host}/api/email/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        },
        body: JSON.stringify({
          folder,
          tls: this.config.tls
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }

      const emails = await response.json();

      // Classify each email
      return emails.map(email => {
        const classification = SpamClassifier.classifyEmail(email);
        
        // If it's classified as spam but in inbox, move it
        if (classification.isSpam && folder === 'inbox') {
          this.moveToSpam(email.id);
          return { ...email, folder: 'spam' };
        }
        
        // If it's not spam but in spam folder, it might be a false positive
        if (!classification.isSpam && folder === 'spam') {
          email.labels = [...(email.labels || []), 'possible_false_positive'];
        }

        return {
          ...email,
          spamScore: classification.score,
          spamReasons: classification.reasons
        };
      });
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      throw error;
    }
  }

  async getLabels(): Promise<Label[]> {
    try {
      const response = await fetch(`https://${this.config.host}/api/email/labels`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch labels');
      }

      return response.json();
    } catch (error) {
      console.error('Failed to fetch labels:', error);
      throw error;
    }
  }

  async createLabel(label: Omit<Label, 'id'>): Promise<Label> {
    try {
      const response = await fetch(`https://${this.config.host}/api/email/labels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        },
        body: JSON.stringify(label)
      });

      if (!response.ok) {
        throw new Error('Failed to create label');
      }

      return response.json();
    } catch (error) {
      console.error('Failed to create label:', error);
      throw error;
    }
  }

  async updateLabel(id: string, updates: Partial<Label>): Promise<void> {
    try {
      const response = await fetch(`https://${this.config.host}/api/email/labels/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update label');
      }
    } catch (error) {
      console.error('Failed to update label:', error);
      throw error;
    }
  }

  async deleteLabel(id: string): Promise<void> {
    try {
      const response = await fetch(`https://${this.config.host}/api/email/labels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete label');
      }
    } catch (error) {
      console.error('Failed to delete label:', error);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const response = await fetch(`https://${this.config.host}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          from: this.config.user
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private async moveToSpam(emailId: string): Promise<void> {
    try {
      await fetch(`https://${this.config.host}/api/email/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        },
        body: JSON.stringify({
          emailId,
          destination: 'spam'
        })
      });
    } catch (error) {
      console.error('Failed to move email to spam:', error);
    }
  }

  async markAsNotSpam(emailId: string): Promise<void> {
    try {
      await fetch(`https://${this.config.host}/api/email/notspam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.user}:${this.config.password}`)}`
        },
        body: JSON.stringify({ emailId })
      });
    } catch (error) {
      console.error('Failed to mark email as not spam:', error);
      throw error;
    }
  }
}