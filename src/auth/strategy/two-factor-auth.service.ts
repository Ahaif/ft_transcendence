import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  private readonly secret: string;

  constructor() {
    // generate a random secret for the user when they enable two-factor authentication
    this.secret = authenticator.generateSecret();
  }

  getQRCodeUrl(user: any) {
    // configure the options for the QR code URL as needed
    // see the documentation for otplib-utils for more information
    const options = {
      label: `Your App: ${user.email}`,
      issuer: 'Your App',
    };
    const uri = authenticator.keyuri(user.email, 'Your App', this.secret);
    return qrcode.toDataURL(uri);
  }

  verifyToken(token: string, user: any) {
    // verify the token using the user's secret and the current time
    const isValid = authenticator.verify({ token, secret: this.secret });
    if (!isValid) {
      throw new Error('Invalid token');
    }
    return user;
  }
}