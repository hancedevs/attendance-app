import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: process.env.EMAIL_AUTH_USER && process.env.EMAIL_AUTH_PASSWORD ? {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD
      } : undefined,
    } as any);
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: process.env.EMAIL_AUTH_USER,
      to,
      subject,
      text,
      html
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
			console.error(error);
			return null;
		}
  }

  async notify(to: string, ){}

}
