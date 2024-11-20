export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  starred: boolean;
  labels: string[];
  accountId?: string;
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | string;

export interface Label {
  id: string;
  name: string;
  color: string;
  accountId?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name?: string;
  server: {
    imap: {
      host: string;
      port: number;
      secure: boolean;
    };
    smtp: {
      host: string;
      port: number;
      secure: boolean;
    };
  };
  isActive: boolean;
}