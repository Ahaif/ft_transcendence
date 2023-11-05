import { Injectable } from '@nestjs/common';
import { gameDto } from './gameDto';
import { ball, player1, stage, player2 } from './data';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chat } from 'src/chat/chat';
import { Server, Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private chat: Chat) {}

  private count = 0;
  // private roomData = new Map<string, any>();
  private roomName = '';

  async ballIntersectWall(ball1: any, signalX: number) {
    let w = stage.w / 2 - stage.cRight.args[0] / 2 - ball.args[0] / 2;
    if (ball1.x + signalX >= w || ball1.x + signalX <= -w) return 1;
    else return 0;
  }

  async ballIntersectPlayer(
    player: any,
    ball1: any,
    signalX: number,
    signalY: number,
  ) {
    let h1 = player.position.y + ball.args[0];
    let h2 = player.position.y - ball.args[0];
    if (ball1.y + signalY == h1 || ball1.y + signalY == h2) {
      let w = player.position.x + player1.size / 2 + ball.args[0];
      let w2 = player.position.x - player1.size / 2 - ball.args[0];
      if (ball1.x + signalX >= w2 && ball1.x + signalX <= w) return 1;
    } else {
      if (player.position.y > 0) {
        if (ball1.y + signalY > player.position.y) {
          return -1;
        }
      } else if (player.position.y < 0) {
        if (ball1.y + signalY < player.position.y) {
          return -1;
        }
      }
    }
  }

  async resetBall(roomName: string, roomData) {
    const room = roomData.get(roomName);
    if (!room || !room.ball) return;
    room.ball.position.x = 0;
    room.ball.position.y = 0;
  }

  async resetPlayers(roomName: string, roomData) {
    const room = roomData.get(roomName);
    if (!room || !room.player1 || !room.player2) return;
    room.player1.position.x = 0;
    room.player2.position.x = 0;
  }
  async disconnect(socket: Socket, server, roomData) {
    for (let [key, value] of roomData) {
      if (socket.id == value?.player1?.socketId) {
        if (value?.status == 'pending') {
          roomData?.delete(key);
        }
        server.to(key).emit('leftGame', {
          status: 'gameOver',
          roomName: key,
          player1: '',
          player2: value?.player2,
        });
        clearInterval(value?.interval);
        roomData?.delete(key);
        return;
      } else if (socket.id == value?.player2?.socketId) {
        server.to(key).emit('leftGame', {
          status: 'gameOver',
          roomName: key,
          player1: value?.player1,
          player2: '',
        });
        clearInterval(value?.interval);
        roomData?.delete(key);
        return;
      }
    }
  }
  async joinPrivateGame(socket, data, server, roomData) {
    const { roomName, type } = data;
    const currentRoom = roomData.get(roomName);
    if (currentRoom && currentRoom.player2.intraName === socket.user.user) {
      if (type == 'accept') {
        roomData.set(roomName, {
          ...currentRoom,
          status: 'pending',
          player2: {
            socketId: socket.id,
            intraName: socket.user.user,
            score: 0,
            position: { x: 0, y: 60 / 2 - 3, z: 0 },
          },
          watchers: [],
          interval: 0,
        });
        socket.join(roomName);
        server.to(roomName).emit('joinRoom', {
          status: 'pending',
          roomName: roomName,
          player1: currentRoom.player1.socketId,
          player2: socket.id,
          dificulty: currentRoom.dificulty,
        });
      } else {
        roomData?.delete(roomName);
      }
    }
  }
  async createPrivateGame(socket, roomData, intraName, userSocket) {
    this.roomName =
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36);
    roomData.set(this.roomName, {
      ball: {
        position: { x: 0, y: 0, z: 1 },
        args: [1, 100, 100],
      },
      player1: {
        socketId: socket.id,
        intraName: socket.user.user,
        score: 0,
        position: { x: 0, y: -60 / 2 + 3, z: 0 },
      },
      player2: {
        intraName: intraName,
        socketId: userSocket,
      },
      type: 'private',
      status: 'created',
      dificulty: 'easy',
    });
    socket.join(this.roomName);
    return socket.to(userSocket).emit('requestToPlay', {
      roomName: this.roomName,
      userName: socket.user.user,
    });
  }
  async findGame(socket, data, server, roomData) {
    let roomFound = [...roomData.entries()]
      .filter(
        ({ 1: v }) => v.status == 'created' && v.dificulty == data.dificulty,
      )
      .map(([k]) => k);
    const currentRoom = roomData.get(roomFound[0]);
    if (!roomFound[0]) {
      this.roomName =
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36);
      roomData.set(this.roomName, {
        ball: {
          position: { x: 0, y: 0, z: 1 },
          args: [1, 100, 100],
        },
        player1: {
          socketId: socket.id,
          intraName: socket.user.user,
          score: 0,
          position: { x: 0, y: -60 / 2 + 3, z: 0 },
        },
        type: 'public',
        status: 'created',
        dificulty: data.dificulty,
      });
      socket.join(this.roomName);
    } else {
      if (currentRoom.player1.intraName === socket.user.user)
        return socket.emit('error');
      roomData.set(roomFound[0], {
        ...currentRoom,
        status: 'pending',
        player2: {
          socketId: socket.id,
          intraName: socket.user.user,
          score: 0,
          position: { x: 0, y: 60 / 2 - 3, z: 0 },
        },
        watchers: [],
        interval: 0,
      });
      socket.join(roomFound[0]);
      server.to(roomFound[0]).emit('joinRoom', {
        status: 'pending',
        roomName: roomFound[0],
        player1: currentRoom.player1.socketId,
        player2: socket.id,
        dificulty: currentRoom.dificulty,
      });
    }
    // let exist = 0;
    // //check if socket already in room
    // for (let [key, value] of roomData) {
    //   if (
    //     socket.id == value?.player1?.socketId ||
    //     socket.id == value?.player2?.socketId
    //   ) {
    //     server.to(this.roomName).emit('joinRoom', {
    //       status: 'You are already in room',
    //     });
    //     console.log('You are already in room');
    //     return;
    //   }
    // }

    // socket.join(this.roomName);

    // if (this.count == 0 && exist == 0) {
    //   roomData.set(this.roomName, {
    //     ...roomData.get(this.roomName),
    //     player1: {
    //       socketId: socket.id,
    //       score: 0,
    //       position: { x: 0, y: -60 / 2 + 3, z: 0 },
    //     },
    //     status2: 'pending',
    //   });
    //   if (data && data.receiverId) {
    //     roomData.set(this.roomName, {
    //       status: 'private',
    //       status2: 'pending',
    //       ...roomData.get(this.roomName),
    //       player2: data.receiverId,
    //     });
    //     this.count = -1;
    //     return;
    //   }
    // } else if (this.count == 1 && exist == 0) {
    //   roomData.set(this.roomName, {
    //     status: 'public',
    //     status2: 'pending',
    //     ...roomData.get(this.roomName),
    //     player2: {
    //       socketId: socket.id,
    //       score: 0,
    //       position: { x: 0, y: 60 / 2 - 3, z: 0 },
    //     },
    //     watchers: [],
    //     interval: 0,
    //   });
    //   this.count = -1;
    // server.to(this.roomName).emit('joinRoom', {
    //   status: 'pending',
    //   roomName: this.roomName,
    //   player1: roomData.get(this.roomName).player1.socketId,
    //   player2: roomData.get(this.roomName).player2.socketId,
    // });
    // }
    // this.count++;
  }

  async startGame(data, server, roomData) {
    const room = roomData.get(data.roomName);
    const roomName = data.roomName;
    const speed = 0.5;
    let time = 20;

    if (!room || !roomName) return;

    if (room.status == 'started') return;

    let signalX = Math.random() > 0.5 ? speed : -speed;
    let signalY = Math.random() > 0.5 ? speed : -speed;

    if (room.dificulty == 'hard') time = 15;
    else if (room.dificulty == 'easy') time = 30;

    await this.chat.setUserStatus(room.player1.intraName, 'in game');

    room.interval = setInterval(async () => {
      room.status = 'started';
      server.to(data.roomName).emit('gameData', {
        status: 'started',
        ball: room.ball.position,
        player1: room.player1.position,
        player2: room.player2.position,
        score: {
          player1: room.player1.score,
          player2: room.player2.score,
        },
      });

      if ((await this.ballIntersectWall(room.ball.position, signalX)) == 1) {
        signalX *= -1;
      }
      if (
        (await this.ballIntersectPlayer(
          room.player1,
          room.ball.position,
          signalX,
          signalY,
        )) == 1 ||
        (await this.ballIntersectPlayer(
          room.player2,
          room.ball.position,
          signalX,
          signalY,
        )) == 1
      ) {
        signalY *= -1;
      } else if (
        (await this.ballIntersectPlayer(
          room.player1,
          room.ball.position,
          signalX,
          signalY,
        )) == -1 ||
        (await this.ballIntersectPlayer(
          room.player2,
          room.ball.position,
          signalX,
          signalY,
        )) == -1
      ) {
        if (room.ball.position.y > 0) room.player1.score++;
        else if (room.ball.position.y < 0) room.player2.score++;
        await this.resetBall(data.roomName, roomData);
        await this.resetPlayers(data.roomName, roomData);
        if (room.player1.score == 10 || room.player2.score == 10) {
          await this.storeData(room.player1, room.player2);
          server.to(data.roomName).emit('gameOver', {
            status: 'gameOver',
            player1: room.player1.score,
            player2: room.player2.score,
          });
          room.status = 'gameOver';
          clearInterval(room.interval);
          await this.chat.setUserStatus(room.player1.intraName, 'online');
          return;
        }
        signalX = Math.random() > 0.5 ? speed : -speed;
        signalY = Math.random() > 0.5 ? speed : -speed;
      }
      room.ball.position.x += signalX;
      room.ball.position.y += signalY;
    }, time);
  }

  async paddleMove(data, server, roomData) {
    const roomName = data.roomName;
    const room = roomData.get(roomName);
    const socketId = data.socketId;
    const right = data.right;
    const left = data.left;
    const w = stage.w / 2 - stage.cRight.args[1] / 2 - player1.size / 2;
    const players = [];

    if (!room || !roomName || !socketId) return;

    if (socketId == room.player1.socketId) {
      if (right && room.player1.position.x + 3 < w)
        room.player1.position.x += 3;
      else if (left && room.player1.position.x - 3 > -w)
        room.player1.position.x -= 3;
      players.push(room.player1.position, room.player2.position);
    } else if (socketId == room.player2.socketId) {
      if (right && room.player2.position.x + 3 < w)
        room.player2.position.x += 3;
      else if (left && room.player2.position.x - 3 > -w)
        room.player2.position.x -= 3;
      players.push(room.player1.position, room.player2.position);
    }
    server.to(roomName).emit('gameData', {
      status: 'started',
      ball: room.ball.position,
      player1: players[0],
      player2: players[1],
      score: {
        player1: room.player1.score,
        player2: room.player2.score,
      },
    });
  }

  async JoinToRoom(data, roomData, socket, server) {
    const roomName = data.roomName;
    const room = roomData.get(data.roomName);
    if (!room || room.status == 'gameOver') return socket.emit('error');
    if (
      room.player1.socketId != socket.id &&
      room.player2.socketId != socket.id &&
      room.player1.intraName != socket.user.user &&
      room.player2.intraName != socket.user.user &&
      !room.watchers.includes(socket.id)
    ) {
      room.watchers.push(socket.id);
      socket.join(data.roomName);
      server.to(roomName).emit('watcher', {
        socketId: socket.id,
        roomName,
        watchersRoom: room.watchers,
      });
    }
  }

  // Database service
  async incrementWins(intraName: string): Promise<void> {
    const user = await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        wins: {
          increment: 1,
        },
      },
    });
  }

  async incrementLosses(intraName: string): Promise<void> {
    const user = await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        losses: {
          increment: 1,
        },
      },
    });
  }

  async incrementDraws(intraName: string): Promise<void> {
    const user = await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        draws: {
          increment: 1,
        },
      },
    });
  }

  async storeData(player1: any, player2: any): Promise<void> {
    let winner = '';
    let loser = '';
    let score = '';
    if (player1.score > player2.score) {
      await this.incrementWins(player1.intraName);
      await this.incrementLosses(player2.intraName);
      winner = player1.intraName;
      loser = player2.intraName;
      score = player1.score + ' - ' + player2.score;
    } else if (player1.score < player2.score) {
      await this.incrementWins(player2.intraName);
      await this.incrementLosses(player1.intraName);
      winner = player2.intraName;
      loser = player1.intraName;
      score = player2.score + ' - ' + player1.score;
    } else {
      await this.incrementDraws(player1.intraName);
      await this.incrementDraws(player2.intraName);
      winner = player1.intraName;
      loser = player2.intraName;
      score = player1.score + ' - ' + player2.score;
    }

    const user1 = await this.prisma.game.create({
      data: {
        winner: winner,
        loser: loser,
        score: score,
        Users: {
          connect: {
            intraName: winner,
          },
        },
        Opponent: {
          connect: {
            intraName: loser,
          },
        },
      },
    });
  }

  async getStats(intraName: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: intraName }, { intraName: intraName }],
      },
      select: {
        wins: true,
        losses: true,
        draws: true,
        games: {
          select: {
            winner: true,
            loser: true,
            score: true,
          },
        },
        opponentGames: {
          select: {
            winner: true,
            loser: true,
            score: true,
          },
        },
      },
    });
    return user;
  }

  async getLeaderboard(): Promise<any> {
    const user = await this.prisma.user.findMany({
      select: {
        username: true,
        wins: true,
        avatar: true,
      },
      orderBy: {
        wins: 'desc',
      },
    });
    return user;
  }
}
