import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { ChatGateway } from '../chat.gateway';


@Catch(WsException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs()
    const client = ctx.getClient() as WebSocket;
    const data = ctx.getData();
    client.emit('error', {message: JSON.stringify(exception.getError())});
  }
}
