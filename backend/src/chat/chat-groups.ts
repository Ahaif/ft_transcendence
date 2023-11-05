import { Chat } from './chat';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { useContainer } from 'class-validator';
import * as cron from 'node-cron';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatGroups {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: Chat,
  ) {}

  async getGroups(intraName: string) {
    const groups = await this.prisma.chatGroup.findMany({
      where: {
        users: {
          some: {
            intraName: intraName,
          },
        },
      },
      include: {
        users: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return groups;
  }

  async isUserInGoup(intraName: string, groupName: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {intraName: intraName},
          {username: intraName}
        ]
      },
      select: {
        chatGroups: {
          where: {
            groupName: groupName,
          },
        },
      },
    });
    if (!user || user.chatGroups.length < 1) {
      throw new Error("Group not found");
    } 
  }

  async getLastGroupsAndMessages(intraName: string) {
    const groups = await this.prisma.chatGroup.findMany({
      where: {
        users: {
          some: {
            intraName: intraName,
          },
        },
      },
      select: {
        groupName: true,
        chatMessages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            username: true,
            message: true,
            createdAt: true,
          },
        },
        users: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return groups;
  }

  async createChatGroup(
    intraName: string,
    name: string,
    password: string,
    isPrivate: boolean,
  ) {
    const channel = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: name,
      },
    });
    if (channel) {
      throw new Error('Chat Group already exist');
    }
    let hashedPassword: string = '';
    if (password.length > 0) {
      // if a password is provided, hash it
      hashedPassword = await bcrypt.hash(password, 10);
    }
    // if(channel.isPrivate && isPrivate)
    // {
    //     throw new Error('Channel is already private')
    // }
    const group = await this.prisma.chatGroup.create({
      data: {
        groupName: name,
        password: hashedPassword,
        ownerId: intraName,
        admin: [intraName],
        isPrivate: isPrivate,
        users: {
          connect: [
            {
              intraName: intraName,
            },
          ],
        },
      },
    });
    return group;
  }

  async isGroupPasswordProtected(groupId: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
    });
    return group.password.length > 0;
  }

  async getGroupPassword(groupId: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
    });
    return group.password;
  }

  async joinGroup(groupId: string, intraName: string, pswd: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        groupName: true,
        password: true,
        banned: true,
        isPrivate: true,
      },
    });
    if (!group) {
      throw new Error('Group Not found');
    }
    if (group.isPrivate) throw new Error(`you can't join a Private channel`);
    const { banned, password } = group;

    if ((await this.isGroupPasswordProtected(groupId)) === true) {
      // check if password matches the hash
      if ((await bcrypt.compare(pswd, password)) === false)
        throw new Error('Wrong password');
    }
    if (banned.includes(intraName)) {
      throw new Error('You Banned from Group you can not join');
    }
    await this.prisma.chatGroup.update({
      where: {
        groupName: groupId,
      },
      data: {
        users: {
          connect: {
            intraName: intraName,
          },
        },
      },
    });
    return group;
  }

  async deleteGroup(intraName: string, groupId: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
    });
    if (group.admin.includes(intraName)) {
      await this.prisma.chatGroup.delete({
        where: {
          groupName: groupId,
        },
      });
    } else {
      throw new Error('You are not the admin of this group');
    }
    return group;
  }

  async addMessageToGroup(groupId: string, message: string, intraName: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        muted: true,
        banned: true,
      },
    });
    if (group.muted.includes(intraName))
      throw new Error('You are Muted you cant send msg');

    if (group.banned.includes(intraName))
      throw new Error('You are banned you cant send msg');

    if (group) {
      await this.prisma.chatGroup.update({
        where: {
          groupName: groupId,
        },
        data: {
          chatMessages: {
            create: {
              message: message,
              Users: {
                connect: {
                  intraName: intraName,
                },
              },
            },
          },
        },
      });
    } else {
      throw new Error('Chat group does not exist');
    }
  }

  async getMessages(groupId: string, intraName: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      include: {
        chatMessages: {
          include: {
            Users: {
              select: {
                username: true,
                avatar: true,
                blockedBy: true,
                blocking: true,
              },
            },
          },
        },
      },
    });
    const { username } = await this.chatService.getUsernameByIntraName(
        intraName,
      );

      let ret = [];
      group.chatMessages.map((message) => {
        const isBlocked =
          message.Users.blocking.some(
            (blockedUser) => blockedUser.blockedUserId === intraName
          ) ||
          message.Users.blockedBy.some(
            (blockedUser) => blockedUser.blockingUserId === intraName
          );

        if (!isBlocked) {
          let messageType: string;
          if (
            message.Users.username === intraName ||
            message.Users.username === username
          ) {
            messageType = 'sent';
          } else {
            messageType = 'received';
          }

          ret.push({
            message: message.message,
            friendUserId: message.Users.username,
            avatar: message.Users.avatar,
            createdAt: message.createdAt,
            messageType: messageType,
          });
        }
      });
      return ret;
  }

  async leaveGroup(groupId: string, intraName: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        users: true,
        ownerId: true,
        admin: true,
      },
    });
    if (group && group.users.length == 1) {
      await this.prisma.chatMessage.deleteMany({
        where: {
          groupName: groupId,
        },
      });

      await this.prisma.chatGroup.delete({
        where: {
          groupName: groupId,
        },
      });
      throw new Error('Channel deleted');
    }
    if (group) {
      if (
        group.admin.length == 1 &&
        group.admin[0] == intraName &&
        group.users.length >= 1 &&
        group.ownerId == intraName
      ) {
        throw new Error('You should seta user as admin before you go ');
      }

      const username = await this.chatService.findUser(intraName);

      await this.prisma.chatGroup.update({
        where: {
          groupName: groupId,
        },
        data: {
          users: {
            disconnect: {
              intraName: username,
            },
          },
        },
      });
    } else {
      throw new Error('Chat group does not exist');
    }
  }

  async removeUserFromGroup(
    groupId: string,
    intraName: string,
    username: string,
  ) {
    const UserIntraName: string = await this.chatService.findUser(username);

    if (!UserIntraName) throw new Error('User not found');
    if (UserIntraName == intraName) throw new Error('you cant Kick yourself');

    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        ownerId: true,
        admin: true,
      },
    });
    if (!group) throw new Error('Group not found');
    if (group.ownerId == UserIntraName)
      throw new Error('you cant Kick Group Owner');
    if (!group.admin.includes(intraName) && group.ownerId !== intraName)
      throw new Error('You are not the admin of this group');
    await this.prisma.chatGroup.update({
      where: {
        groupName: groupId,
      },
      data: {
        users: {
          disconnect: {
            intraName: UserIntraName,
          },
        },
      },
    });
  }

  async isGroupOrUser(groupId: string) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
    });
    if (group) {
      return 'group';
    } else {
      const user = await this.chatService.findUser(groupId);
      if (user) {
        return user;
      } else {
        throw new Error('Chat group or user does not exist');
      }
    }
  }

  async getGroupInfo(groupId: string, username: string) {
    const intraName = await this.chatService.findUser(username);
    if (!intraName) throw new Error('User not found');
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        ownerId: true,
        admin: true,
        users: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!group) throw new Error('Group not found');
    let ret = {
      admin: false,
      users: group.users,
    };
    if (group.admin.includes(intraName) || group.ownerId == intraName) {
      ret.admin = true;
    }
    return ret;
  }

  // && group.users.length > 1

  async setAdminUser(
    groupId: string,
    userId: string,
    adminUser: string,
  ): Promise<boolean | null> {
    const intraName = await this.chatService.findUser(userId);
    if (!intraName) {
      throw new Error('User not found');
    }

    const channel = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        ownerId: true,
        admin: true,
        banned: true,
      },
    });

    if (!channel) {
      throw new Error('Chat group not found');
    }

    const { ownerId, admin, banned } = channel;
    if (banned.includes(adminUser)) {
      throw new Error('User is Banned from this channel');
    }
    if (admin.includes(adminUser)) {
      throw new Error('User is already admin');
    }

    if (!admin.includes(adminUser) && ownerId !== userId) {
      throw new Error('You are not allowed to add as admin');
    }

    // Update the chat group to add admin to admins[]
    const updatedChannel = await this.prisma.chatGroup.update({
      where: {
        groupName: groupId,
      },
      data: {
        admin: [...admin, adminUser],
      },
    });
    return updatedChannel !== null;
  }

  async banUser(
    groupId: string,
    user: string,
    banUser: string,
  ): Promise<boolean | null> {
    if (user == banUser) {
      throw new Error('You cant Ban yourself');
    }
    const channel = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupId,
      },
      select: {
        ownerId: true,
        admin: true,
        banned: true,
      },
    });

    if (!channel) {
      throw new Error('Chat group not found');
    }

    const { ownerId, admin, banned } = channel;
    if (!admin.includes(user) && ownerId !== user) {
      throw new Error('You are not allowed to Ban a user');
    }
    if (ownerId == banUser) throw new Error('you can not ban group owner');
    if (banned.includes(banUser)) {
      throw new Error('User Already Banned');
    }

    const updatedChannel = await this.prisma.chatGroup.update({
      where: {
        groupName: groupId,
      },
      data: {
        users: {
          disconnect: {
            intraName: banUser,
          },
        },
        banned: [...banned, banUser],
      },
    });

    return updatedChannel !== null;
  }

  async muteUser(
    groupName: string,
    currentUser: string,
    userToMute: string,
    duration: number,
  ) {
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupName,
      },
    });
    if (currentUser == userToMute) throw new Error(' you cant Mute yourself');

    if (!group) {
      throw new Error('Chat group does not exist');
    }

    if (group.ownerId !== currentUser && !group.admin.includes(currentUser)) {
      throw new Error('You do not have permission to mute users');
    }

    if (group.muted.includes(userToMute)) {
      throw new Error('User is already muted');
    }

    await this.prisma.chatGroup.update({
      where: {
        groupName: groupName,
      },
      data: {
        muted: {
          push: userToMute,
        },
      },
    });

    // Schedule a task to unmute the user after the specified duration
    setTimeout(() => {
      this.unmuteUser(groupName, userToMute);
    }, duration * 1000); // Convert duration to milliseconds
  }

  async unmuteUser(groupName: string, userToUnmute: string) {

    // Retrieve the chat group
    const group = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: groupName,
      },
    });

    if (!group) {
      throw new Error('Chat group does not exist');
    }

    // Remove the userToUnmute from the muted array
    const updatedMuted = group.muted.filter(
      (user: string) => user !== userToUnmute,
    );

    // Update the chat group with the updated muted array
    await this.prisma.chatGroup.update({
      where: {
        groupName: groupName,
      },
      data: {
        muted: updatedMuted,
      },
    });
  }

  async changePrivacy(user: string, channelName: string) {
    const channel = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: channelName,
      },
      select: {
        ownerId: true,
        admin: true,
        isPrivate: true,
      },
    });

    if (!channel) {
      throw new Error('Chat group not found');
    }

    if (!channel.admin.includes(user)) {
      throw new Error('You are not allowed to do this');
    }
    if (channel.isPrivate == false) {
      await this.prisma.chatGroup.update({
        where: {
          groupName: channelName,
        },
        data: {
          isPrivate: true,
        },
      });
    } else {
      await this.prisma.chatGroup.update({
        where: {
          groupName: channelName,
        },
        data: {
          isPrivate: false,
        },
      });
    }
    return channel.isPrivate;
  }

  async removePassword(user: string, channelName: string) {
    const channel = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: channelName,
      },
      select: {
        ownerId: true,
        admin: true,
        password: true,
      },
    });

    if (!channel) {
      throw new Error('Chat group not found');
    }

    if (!channel.admin.includes(user) && user != channel.ownerId) {
      throw new Error('You are not allowed to do this');
    }
    if (channel.password == '') {
      throw new Error('Channel has no password');
    }
    await this.prisma.chatGroup.update({
      where: {
        groupName: channelName,
      },
      data: {
        password: '',
      },
    });
  }

  async changePassword(user: string, channelName: string, newPass: string) {
    const channel = await this.prisma.chatGroup.findUnique({
      where: {
        groupName: channelName,
      },
      select: {
        ownerId: true,
        admin: true,
        password: true,
      },
    });

    if (!channel) {
      throw new Error('Chat group not found');
    }

    if (!channel.admin.includes(user) && user != channel.ownerId) {
      throw new Error('You are not allowed to do this');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this.prisma.chatGroup.update({
      where: {
        groupName: channelName,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async isUserOrGroup(username: string): Promise<Boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { intraName: username}
        ]
      }
    });
    if (user)
      return false;
    return true;
   }
}
