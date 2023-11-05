import { User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Chat {
  constructor(private prisma: PrismaService) {}

  private users: any = {};

  private userStatus: Map<string, string> = new Map();

  async getUserStatus(intraName: string) {
    return this.userStatus.get(intraName);
  }

  async setUserStatus(intraName: string, status: string) {
    return this.userStatus.set(intraName, status);
  }

  async findUser(intraName: string): Promise<string | null> {
    if (!intraName || intraName === '' || intraName === null) return null;
    const user = await this.prisma.user.findUnique({
      where: {
        intraName: intraName,
      },
      select: {
        intraName: true,
      },
    });
    if (user && user.intraName === intraName) {
      return intraName;
    } else {
      const user = await this.prisma.user.findUnique({
        where: {
          username: intraName,
        },
        select: {
          intraName: true,
        },
      });
      if (user) {
        return user.intraName;
      } else {
        return null;
      }
    }
  }

  async getUsernameByIntraName(intraName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        intraName: intraName,
      },
      select: {
        username: true,
        avatar: true,
      },
    });
    if (user) {
      return { username: user.username, avatar: user.avatar };
    } else {
      return null;
    }
  }

  async addMessages(message: string, from: string, to: string) {
    let toIntraName = await this.prisma.user.findUnique({
      where: {
        username: to,
      },
      select: {
        intraName: true,
      },
    });
    toIntraName.intraName = toIntraName.intraName || to;
    let user = await this.prisma.message.create({
      data: {
        Users: { connect: { intraName: from } },
        FriendUsers: { connect: { intraName: toIntraName.intraName } },
        message: message,
      },
    });
    return user;
  }
  async getUserByuserName(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        intraName: true,
        avatar: true,
      },
    });
    if (user) {
      return { intraName: user.intraName, avatar: user.avatar };
    } else {
      return null;
    }
  }

  async getMessages(intraName: string, friendname: string) {
    const friendIntraName = await this.findUser(friendname);
    if (!friendIntraName) {
      throw new Error('User not found');
    }
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { userId: intraName, friendUserId: friendIntraName },
          { userId: friendIntraName, friendUserId: intraName },
        ],
      },
      select: {
        message: true,
        createdAt: true,
        userId: true,
        Users: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages.map((message) => ({
      message: message.message,
      avatar: message.Users.avatar,
      username: message.Users.username,
      createdAt: message.createdAt,
      messageType: message.userId === intraName ? 'sent' : 'received',
    }));
  }

  async getLastMessages(intraName: string) {
    let user = await this.prisma.user.findUnique({
      where: {
        intraName,
      },
      select: {
        intraName: true,
        messages: {
          select: {
            message: true,
            createdAt: true,
            FriendUsers: {
              select: {
                avatar: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          distinct: ['friendUserId'],
          take: 10,
        },
      },
    });
    let ret = [];
    user.messages.map((message) => {
      ret.push({
        message: message.message,
        createdAt: message.createdAt,
        friendUserId: message.FriendUsers.username,
        avatar: message.FriendUsers.avatar,
      });
    });
    user.messages = ret;
    return user;
  }

  async getLastMessagesFriend(intraName: string) {
    let user = await this.prisma.user.findUnique({
      where: {
        intraName,
      },
      select: {
        intraName: true,
        friendMessages: {
          select: {
            message: true,
            createdAt: true,
            Users: {
              select: {
                avatar: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          distinct: ['userId'],
        },
      },
    });
    let ret = [];
    user.friendMessages.map((message) => {
      ret.push({
        message: message.message,
        createdAt: message.createdAt,
        friendUserId: message.Users.username,
        avatar: message.Users.avatar,
      });
    });

    const result = {
      intraName: user.intraName,
      messages: ret,
    };
    return result;
  }

  async getUser(intaName: string) {
    const userName = await this.findUser(intaName);
    if (!userName) {
      throw new Error('User not found');
    }
    return this.users[userName];
  }

  async addUser(intaName: string, socketID: any) {
    const tmp = await this.prisma.user.findUnique({
      where: {
        intraName: intaName,
      },
      select: {
        intraName: true,
      },
    });
    if (tmp && tmp.intraName === intaName) this.users[intaName] = socketID;
    else {
      let intraName = await this.prisma.user.findUnique({
        where: {
          username: intaName,
        },
        select: {
          intraName: true,
        },
      });
      if (intraName && intraName.intraName)
        this.users[intraName.intraName] = socketID;
      else throw new Error('User not found');
    }
  }

  async removeUser(intaName: string) {
    delete this.users[intaName];
  }
  getSocketIdbyUsername(username: string) {
    return this.users[username];
  }
}
