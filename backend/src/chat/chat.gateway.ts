import { ChatGroups } from './chat-groups';
import { join } from 'path';
import { WsGuard } from './ws/ws.guard';
import { Jwt } from './../auth/jwt/jwt';
import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Chat } from './chat';
import { Friendship } from 'src/friendship/friendship/friendship';
import { GameService } from 'src/game/game.service';
import { gameDto } from '../game/gameDto';
import {
  ChangePasswordDTO,
  GroupDTO,
  GroupMessageDTO,
  MuteDTO,
  PrivateMessageDTO,
} from 'src/DTOs/ChatDTO';
import { ClientType } from './types/ClientType';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { WsvalidationPipe } from './ws/wsvalidation-pipe';
import { WebsocketExceptionsFilter } from './ws/wsvalidation-filter';
@WebSocketGateway()
@UseGuards(WsGuard)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private connectedClients: Map<string, Socket> = new Map<string, Socket>();
  constructor(
    private readonly jwt: Jwt,
    private readonly jwtService: JwtService,
    private readonly chatSerivce: Chat,
    private readonly chatGroups: ChatGroups,
    private readonly friendShip: Friendship,
    private gameService: GameService,
  ) {}

  @WebSocketServer() wss: Server;
  roomData = new Map<string, any>();
  roomName = '';

  private logger: Logger = new Logger('ChatGateway');

  async afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @UseGuards(WsGuard)
  async handleConnection(client: ClientType) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    try {
      const user = await this.jwtService.verify(token);
      client.user = user;
    } catch (e: any) {
      client.disconnect();
    }
    if (!client.user) {
      client.disconnect();
      return;
    }
    try {
      client.broadcast.emit('message', {
        message: 'User connected',
        user: client.user.user,
      });
      await this.chatSerivce.addUser(client.user.user, client.id);
      const groups = await this.chatGroups.getGroups(client.user.user);
      groups.forEach((group: any) => {
        if (!client.rooms.has(group.groupName)) client.join(group.groupName); // toast loop hell on the front end
      });
      this.connectedClients.set(client.user.user, client);
      this.logger.log('Client connected: ' + client.id);
      await this.chatSerivce.setUserStatus(client.user.user, 'online');
    } catch (error) {
      this.logger.log(error);
    }
  }

  async handleDisconnect(client: ClientType) {
    this.chatSerivce.removeUser(client.user.user);
    this.connectedClients.delete(client.user.user);
    await this.chatSerivce.setUserStatus(client.user.user, 'offline');
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.gameService.disconnect(client, this.wss, this.roomData);
  }

  @SubscribeMessage('dm')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async handleMessage(client: ClientType, payload: PrivateMessageDTO) {
    this.logger.log(`private message received: ${payload}`);
    const { username, avatar } = await this.chatSerivce.getUsernameByIntraName(
      client.user.user,
    );
    try {
      const user = await this.chatSerivce.getUser(payload.to);
      const friendName = await this.chatSerivce.findUser(payload.to);
      const isBlocked = await this.friendShip.isBlockedd(
        client.user.user,
        friendName,
      );
      if (
        (await this.friendShip.blockedYou(client.user.user, friendName)) ||
        isBlocked
      )
        throw 'User not found';
      this.wss.to(user).emit('dm', {
        message: payload.message,
        from: username === user ? 'me' : 'them',
        to: payload.to,
        avatar: avatar,
        sender: username,
      });
      await this.chatSerivce.addMessages(
        payload.message,
        client.user.user,
        payload.to,
      );
      const info = await this.chatSerivce.getLastMessages(client.user.user);
      info.messages[0].message = '';
      const intraNameUser = await this.chatSerivce.getUserByuserName(
        payload.to,
      );
      const friendInfo = await this.chatSerivce.getLastMessagesFriend(
        intraNameUser.intraName,
      );
      if (friendInfo.messages && friendInfo.messages.length > 0)
        friendInfo.messages[0].message = 'new message';

      this.wss.to(user).emit('getInfo', friendInfo);
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: 'User is not found' });
      return;
    }
  }

  @SubscribeMessage('createRoom')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async handleCreateRoom(client: ClientType, payload: GroupDTO) {
    try {
      const { roomName, password, isPrivate } = payload;
      const roomy = await this.chatSerivce.findUser(roomName);
      if (roomy) throw new Error('Group cannot have the same name as a user !');
      const intraName = await this.chatSerivce.findUser(client.user.user);
      if (!intraName) throw new Error('User not found');
      const room = await this.chatGroups.createChatGroup(
        intraName,
        roomName,
        password,
        isPrivate,
      );
      client.join(room.groupName);
      this.wss.to(client.id).emit('info', { message: 'room created' });
      this.handleGetGroups(client, {});
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('joinRoom')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async handleJoinRoom(client: ClientType, payload: GroupDTO) {
    const { roomName, password } = payload;
    try {
      const room = await this.chatGroups.joinGroup(
        roomName,
        client.user.user,
        password,
      );
      client.join(room.groupName);
      this.wss.to(room.groupName).emit('info', {
        message: `${client.user.user} has joined ${roomName}`,
      });
      //   await this.handleGetGroups(client, {});

      await this.getGroupInfo(client, { groupName: roomName });
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
      return;
    }
  }
  @SubscribeMessage('dmRoom')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async handleRoomMessage(client: ClientType, payload: GroupMessageDTO) {
    const { message, group } = payload;
    if (message && group) {
      try {
        const { username, avatar } =
          await this.chatSerivce.getUsernameByIntraName(client.user.user);
        await this.chatGroups.isUserInGoup(username, group);
        await this.chatGroups.addMessageToGroup(
          group,
          message,
          client.user.user,
        );
        const { blockedUsernames, blockedByUsernames } =
          await this.friendShip.myBlocked(client.user.user);
        const socketsInGroup = await this.wss.in(group).fetchSockets();
        socketsInGroup.map((socket: any) => {
          if (
            socket &&
            !blockedUsernames.includes(socket.user.user) && // Check if the socket's user is in the blockedUsernames array
            !blockedByUsernames.includes(socket.user.user) // Check if the socket's user is in the blockedByUsernames array
          ) {
            socket.emit('dmRoom', {
              message: message,
              from: client.user.user,
              group: group,
              avatar: avatar,
              username: username,
            });
          }
        });
      } catch (e: any) {
        this.wss.to(client.id).emit('error', { message: e.message });
      }
    } else {
      this.wss
        .to(client.id)
        .emit('error', { message: 'Invalid group or message' });
    }
  }

  @SubscribeMessage('leaveGroup')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async handleLeaveRoom(client: ClientType, payload: any) {
    const { roomName } = payload.groupName;
    try {
      await this.chatGroups.leaveGroup(payload.groupName, client.user.user);
      client.leave(roomName);
      this.wss.to(client.id).emit('success', { message: 'Group left' });
      await this.handleGetGroups(client, {});
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('removeUser')
  @UseGuards(WsGuard)
  async handleRemoveUser(client: ClientType, payload: any) {
    const { roomName, username } = payload;
    try {
      await this.chatGroups.removeUserFromGroup(
        roomName,
        client.user.user,
        username,
      );
      this.wss.to(roomName).emit('info', {
        message: `${username} has been removed from the group`,
      });
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('getGroups')
  @UseGuards(WsGuard)
  async handleGetGroups(client: ClientType, payload: any) {
    try {
      const groups = await this.chatGroups.getLastGroupsAndMessages(
        client.user.user,
      );
      this.wss.to(client.id).emit('groups', groups);
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('getInfo')
  @UseGuards(WsGuard)
  async getChatInfo(client: ClientType) {
    try {
      let info = await this.chatSerivce.getLastMessages(client.user.user);
      if (info.messages.length < 1) {
        info = await this.chatSerivce.getLastMessagesFriend(client.user.user);
        if (!info.messages.length) return;
      }
      info.messages[0].message = '';
      this.wss.to(client.id).emit('getInfo', info);
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('getChatMessages')
  @UseGuards(WsGuard)
  async getChatMessages(client: ClientType, payload: any) {
    try {
      const usr = await this.chatGroups.isGroupOrUser(payload.username);
      if (usr !== 'group') {
        if (usr === null || usr === undefined)
          throw new Error('User not found');
        const messages = await this.chatSerivce.getMessages(
          client.user.user,
          usr,
        );
        this.wss.to(client.id).emit('getChatMessages', messages);
      } else {
        const messages = await this.chatGroups.getMessages(
          payload.username,
          client.user.user,
        );
        this.wss.to(client.id).emit('getChatMessages', messages);
      }
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('groupInfo')
  @UseGuards(WsGuard)
  async getGroupInfo(client: ClientType, payload: any) {
    try {
      const info = await this.chatGroups.getGroupInfo(
        payload.groupName,
        client.user.user,
      );
      this.wss.to(client.id).emit('groupInfo', info);
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('deleteFromGroup')
  @UseGuards(WsGuard)
  async deleteFromGroup(client: ClientType, payload: any) {
    try {
      await this.chatGroups.removeUserFromGroup(
        payload.groupName,
        client.user.user,
        payload.username,
      );
      this.wss.to(client.id).emit('info', {
        message: `${payload.username} has been deleted from the group`,
      });
      await this.getGroupInfo(client, payload);
      await this.handleGetGroups(client, {});
    } catch (e: any) {
      this.wss.to(client.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('setAdmin')
  @UseGuards(WsGuard)
  async setAdminUser(client: ClientType, payload: any) {
    try {
      const intraNameAdmin = await this.chatSerivce.findUser(payload.username);
      if (!intraNameAdmin) throw new Error('User not found');
      await this.chatGroups.setAdminUser(
        payload.groupName,
        client.user.user,
        intraNameAdmin,
      );
      this.wss.to(client.id).emit('success', {
        message: `${payload.username} has been Added as Admin`,
      });
      await this.getGroupInfo(client, payload);
    } catch (error: any) {
      this.wss.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('banUser')
  @UseGuards(WsGuard)
  async banUser(client: ClientType, payload: any) {
    try {
      const UserToBan = await this.chatSerivce.findUser(payload.username);
      if (!UserToBan) throw new Error('User not found');

      await this.chatGroups.banUser(
        payload.groupName,
        client.user.user,
        UserToBan,
      );
      this.wss
        .to(client.id)
        .emit('success', { message: `${payload.username} has been Banned` });
      await this.getGroupInfo(client, payload);
    } catch (error: any) {
      this.wss.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('muteUser')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async muteUser(client: ClientType, payload: MuteDTO) {
    try {
      const userToMute = await this.chatSerivce.findUser(payload.username);
      if (!userToMute) {
        throw new Error('User not found');
      }

      await this.chatGroups.muteUser(
        payload.groupName,
        client.user.user,
        userToMute,
        payload.duration,
      );
      this.wss.to(client.id).emit('success', {
        message: `${payload.username} has been muted for ${payload.duration} seconds `,
      });
      await this.getGroupInfo(client, payload);
    } catch (error: any) {
      this.wss.to(client.id).emit('error', { message: error.message });
    }
  }
  @SubscribeMessage('getUserStatus')
  @UseGuards(WsGuard)
  async getUserStatus(client: ClientType, payload: any) {
    const { username } = payload;
    const intraName = await this.chatSerivce.findUser(username);
    const isConnected = this.connectedClients.has(intraName);

    const status = isConnected ? 'online' : 'offline';
    client.emit('userStatus', status);
  }

  @SubscribeMessage('changePrivacy')
  @UseGuards(WsGuard)
  async changePrivacy(client: ClientType, payload: any) {
    try {
      const user = await this.chatSerivce.findUser(client.user.user);
      if (!user) throw new Error('User not found');
      const isPrivate = await this.chatGroups.changePrivacy(
        client.user.user,
        payload.groupName,
      );
      if (isPrivate)
        this.wss
          .to(client.id)
          .emit('success', { message: `Channel is Public Now` });
      else
        this.wss
          .to(client.id)
          .emit('success', { message: `Channel is Private Now` });
      await this.getGroupInfo(client, payload);
    } catch (error: any) {
      this.wss.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('removePassword')
  @UseGuards(WsGuard)
  async removePassword(client: ClientType, payload: any) {
    try {
      const user = await this.chatSerivce.findUser(client.user.user);
      if (!user) throw new Error('User not found');
      await this.chatGroups.removePassword(client.user.user, payload.groupName);
      this.wss
        .to(client.id)
        .emit('success', { message: `Password Removed Succefuly` });
    } catch (error: any) {
      this.wss.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('changePassword')
  @UseGuards(WsGuard)
  @UsePipes(WsvalidationPipe)
  @UseFilters(WebsocketExceptionsFilter)
  async changePassword(client: ClientType, payload: ChangePasswordDTO) {
    try {
      if (payload.newPassword == '') throw new Error('Type some PWD');
      const user = await this.chatSerivce.findUser(client.user.user);
      if (!user) throw new Error('User not found');
      await this.chatGroups.changePassword(
        client.user.user,
        payload.groupName,
        payload.newPassword,
      );
      this.wss
        .to(client.id)
        .emit('success', { message: `Password Changed Succefuly` });
    } catch (error: any) {
      this.wss.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leftRoom')
  @UseGuards(WsGuard)
  async leftRoom(
    @MessageBody() data: { roomName: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomName } = data;

    const room = this.roomData.get(roomName);
    if (!room) return socket.emit('error');
    // If one of the players leave
    if (room.player1.socketId == socket.id) {
      this.roomData?.delete(roomName);
      await this.chatSerivce.setUserStatus(room.player1.intraName, 'online');
      return socket.to(roomName).emit('leftGame', {
        status: 'gameOver',
        player2: room.player2.socketId,
        player1: '',
      });
    }
    if (room.player2.socketId == socket.id) {
      this.roomData?.delete(roomName);
      await this.chatSerivce.setUserStatus(room.player2.intraName, 'online');
      return socket.to(roomName).emit('leftGame', {
        status: 'gameOver',
        player1: room.player1.socketId,
        player2: '',
      });
    }
    // If one of the watchers leave
    let tmp = room.watchers.filter((e: string) => e != socket.id);
    this.roomData.set(this.roomName, { ...room, watchers: [...tmp] });
    socket.leave(roomName);
    return socket.to(roomName).emit('watcher', {
      socketId: socket.id,
      type: 'LEAVE',
      watchersRoom: [...tmp],
    });
  }
  @SubscribeMessage('createPrivateGame')
  @UseGuards(WsGuard)
  async createPrivateGame(
    @ConnectedSocket() socket: any,
    @MessageBody() data: { username: string },
  ) {
    try {
        const { username } = data;
        const { intraName } = await this.chatSerivce.getUserByuserName(username);
        const userSocket = this.chatSerivce.getSocketIdbyUsername(intraName);
        await this.gameService.createPrivateGame(
          socket,
          this.roomData,
          intraName,
          userSocket,
        );
        await this.chatSerivce.setUserStatus(socket.user.user, 'in game');
    } catch (e: any) {
        this.wss.to(socket.id).emit('error', {message: "Something went wrong"});
    }
  }
  @SubscribeMessage('joinPrivateGame')
  @UseGuards(WsGuard)
  async joinPrivateGame(
    @ConnectedSocket() socket: any,
    @MessageBody()
    data: {
      type: string;
      roomName: string;
      otherPlayer?: string;
    },
  ) {
    try {
        let user: string = null;
          if (data.otherPlayer) {
            user = await this.chatSerivce.getUser(data.otherPlayer);
          }
          if (data.type === 'reject') {
            this.wss.to(user).emit('InviteRejected', {});
            return;
          }
          await this.gameService.joinPrivateGame(socket, data, this.wss, this.roomData);
          await this.chatSerivce.setUserStatus(socket.user.user, 'in game');
    } catch (e: any) {
        this.wss.to(socket.id).emit('error', {message: "Something went wrong"});
    }
  }

  @SubscribeMessage('findGame')
  @UseGuards(WsGuard)
  async findGame(@ConnectedSocket() socket: any, @MessageBody() data: gameDto) {
    try {
        await this.gameService.findGame(socket, data, this.wss, this.roomData);
        await this.chatSerivce.setUserStatus(socket.user.user, 'in game');
    } catch (e: any) {
      this.wss.to(socket.id).emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('acceptGame')
  @UseGuards(WsGuard)
  async acceptGame(
    @MessageBody() data: gameDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
        const room = this.roomData.get(data.roomName);
        const roomName = data.roomName;
        const id = 1;
        const player1 = room.player1;
        const status = data.status;
        if (!room || !roomName || id !== room.player2) return;
        if (!status || status !== 'accept') return;
        socket.join(roomName);
        this.roomData.set(roomName, {
          player1,
          player2: {
            socketId: socket.id,
            score: 0,
            position: { x: 0, y: 60 / 2 - 3, z: 0 },
          },
          watchers: [],
          interval: 0,
        });
    } catch (e: any) {
      return;
    }
  }

  @SubscribeMessage('startGame')
  @UseGuards(WsGuard)
  async startGame(client: ClientType, @MessageBody() data: gameDto) {
    try {
      await this.gameService.startGame(data, this.wss, this.roomData);
      await this.chatSerivce.setUserStatus(client.user.user, 'in game');
    } catch (e: any) {
      return;
    }
  }

  @SubscribeMessage('paddleMove')
  @UseGuards(WsGuard)
  async paddleMove(@MessageBody() data: gameDto) {
    try {
      await this.gameService.paddleMove(data, this.wss, this.roomData);
    } catch (e: any) {
      return;
    }
  }

  @SubscribeMessage('joinToRoom')
  @UseGuards(WsGuard)
  async JoinToRoom(
    @MessageBody() data: gameDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      await this.gameService.JoinToRoom(data, this.roomData, socket, this.wss);
    } catch (e: any) {
      this.wss.emit('error', {message: "Something went wrong"});
    }
  }

  @SubscribeMessage('getStatus')
  @UseGuards(WsGuard)
  async getStatus(client: ClientType, payload: any) {
    try {
      const user = await this.chatSerivce.findUser(payload.username);
      if (!user) throw new Error('User not found');
      const status = await this.chatSerivce.getUserStatus(user);
      this.wss.to(client.id).emit('getStatus', { status });
    } catch (error: any) {
      this.wss.to(client.id).emit('error', {message: "Something went wrong"});
    }
  }
}
