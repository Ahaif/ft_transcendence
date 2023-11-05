import { Injectable } from '@nestjs/common';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsvalidationPipe extends ValidationPipe {
    createExceptionFactory() {
        return (validationErrors = []) => {
          if (this.isDetailedOutputDisabled) {
            return new WsException('Bad request');
          }
          const errors = this.flattenValidationErrors(validationErrors);

          return new WsException(errors);
        };
    }
  }
