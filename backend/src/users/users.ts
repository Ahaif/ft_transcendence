import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class Users {
  constructor(private prisma: PrismaService) {}

  public async getUserInfo(intraName: string) {
    return await this.prisma.user.findUnique({
      where: {
        intraName: intraName,
      },
    });
  }

  public async disableTwoFactor(intraName: string) {
    return await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        otpEnabled: false,
        otpSecret: null,
      },
    });
  }

  public async enableTwoFactor(intraName: string) {
    return await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        otpEnabled: true,
      },
    });
  }

  public async setTwoFactor(intraName: string, secret: string) {
    return await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        otpSecret: secret,
      },
    });
  }

  public async updateUserInfo(intraName: string, data: any) {
    return await this.prisma.user.update({
      where: {
        intraName: intraName,
      },
      data: {
        username: data.username,
      },
    });
  }

  public async updateAllInfo(intraName: string, data: any, filename: string) {
    const url = process.env.MAIN_URL || 'http://localhost:3000/';
    if (data.username === undefined || data.username === null) {
      return await this.prisma.user.update({
        where: {
          intraName: intraName,
        },
        data: {
          avatar: url + filename,
        },
      });
    } else {
      return await this.prisma.user.update({
        where: {
          intraName: intraName,
        },
        data: {
          username: data.username,
          avatar: url + filename,
        },
      });
    }
  }

  public async getTwoFactor(intraName: string) {
    return await this.prisma.user
      .findUnique({
        where: {
          intraName: intraName,
        },
      })
      .then((user) => {
        return user.otpSecret;
      });
  }

  public async deleteUser(intraName: string) {
    if (intraName !== undefined && intraName !== null) {
      const user = await this.prisma.user.findUnique({
        where: {
          intraName: intraName,
        },
        include: {
          userFriends: true,
          friendUserFriends: true,
          messages: true,
          friendMessages: true,
          chatGroups: true,
          chatMessages: true,
          blockedBy: true,
          blocking: true,
          games: true,
          opponentGames: true,
        },
      });
  
      if (!user) {
        throw new HttpException('User not found', 404);
      }
  
      // Delete related records
      const deletePromises = [];
  
      for (const blockedUser of user.blockedBy) {
        deletePromises.push(
          this.prisma.blockedUser.delete({
            where: {
              id: blockedUser.id,
            },
          })
        );
      }
  
      for (const blockedUser of user.blocking) {
        deletePromises.push(
          this.prisma.blockedUser.delete({
            where: {
              id: blockedUser.id,
            },
          })
        );
      }
  
      for (const message of user.friendMessages) {
        deletePromises.push(
          this.prisma.message.delete({
            where: {
              id: message.id,
            },
          })
        );
      }
  
      for (const message of user.messages) {
        deletePromises.push(
          this.prisma.message.delete({
            where: {
              id: message.id,
            },
          })
        );
      }
  
      for (const friend of user.friendUserFriends) {
        deletePromises.push(
          this.prisma.friends.delete({
            where: {
              id: friend.id,
            },
          })
        );
      }
  
      for (const friend of user.userFriends) {
        deletePromises.push(
          this.prisma.friends.delete({
            where: {
              id: friend.id,
            },
          })
        );
      }
  
      for (const group of user.chatGroups) {
        deletePromises.push(
          this.prisma.chatGroup.delete({
            where: {
              groupName: group.groupName,
            },
          })
        );
      }
  
      for (const message of user.chatMessages) {
        deletePromises.push(
          this.prisma.chatMessage.delete({
            where: {
              id: message.id,
            },
          })
        );
      }
  
      // Delete games and opponent relations
      for (const game of user.games) {
        deletePromises.push(
          this.prisma.game.delete({
            where: {
              id: game.id,
            },
          })
        );
      }
  
      for (const game of user.opponentGames) {
        deletePromises.push(
          this.prisma.game.delete({
            where: {
              id: game.id,
            },
          })
        );
      }
  
      // Execute all delete operations
      await Promise.all(deletePromises);
  
      // Delete the user
      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
    } else {
      throw new HttpException('User not found', 404);
    }
  }
  
  

  public async getPublicInfo(intra: string) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {intraName: intra},
          {username: intra},
        ]
    
      },
      select: {
        username: true,
        intraName: true,
        avatar: true,
        id: true,
        coalition: true,
        clCoverUrl: true,
        clColor: true,
        clImageUrl: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  public async searchUser(search: string) {
    let user = await this.prisma.user.findMany({
      where: {
        username: {
          startsWith: search,
        },
      },
      select: {
        username: true,
        avatar: true,
      },
    });
    if (!user.length) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  public async getAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        username: true,
        avatar: true,
      },
    });
  }
}
