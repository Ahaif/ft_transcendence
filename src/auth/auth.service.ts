import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    return 'Hello World You should Authenticate!';
  }

  getTest(): string{
    return 'This is A test';
  }
}
