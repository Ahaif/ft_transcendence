import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  HomePage(): string {
    throw new HttpException('Not implemented', 501);
  }
}
