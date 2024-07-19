import {createTransport} from 'nodemailer-mock';
import {describe, it, expect, vi} from 'vitest';
import {type Email, sendEmail} from './send';
import {ExampleEmail} from '../emails';

// Mock the necessary environment variables
vi.mock('../env', () => ({
  env: {
    SMTP_HOST: 'smtp.example.com',
    SMTP_USER: 'user@example.com',
    SMTP_PASSWORD: 'password123'
  }
}));

describe('sendEmail', () => {
  const mockTransport = createTransport({
    host: 'smtp.example.com',
    auth: {
      user: 'user@example.com',
      pass: 'password123'
    }
  });

  it('sends an email with the correct parameters', async () => {
    const email: Email = {
      subject: 'Test Subject',
      from: 'sender@example.com',
      to: 'recipient@example.com',
      template: <ExampleEmail />
    };

    const result = await sendEmail(email, mockTransport);
    expect(result.response).toBe('nodemailer-mock success');
  });
});
