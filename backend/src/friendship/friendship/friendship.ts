import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class Friendship {
    constructor(private prisma: PrismaService) {}

    public async getFriendship(intraName: string) {
        return await this.prisma.user.findUnique({
            where : {
                intraName: intraName
            },
            select: {
                userFriends: {
                    select: {
                        FriendUsers: {
                            select: {
                                intraName: true,
                                avatar: true,
                            },
                        },
                        status: true,
                    }
                }
            }
        });
    }

    public async addFriend(intraName: string, friendname: string) {
        const user = await this.prisma.user.findUnique({ where: { intraName } });
        const friend = await this.prisma.user.findUnique({ where: { intraName: friendname } });

        if (!user || !friend) {
          throw new Error('User or friend not found.');
        }

        // Check if the friend has blocked the user
        const blockedByFriend = await this.prisma.blockedUser.findFirst({
          where: { blockingUserId: user.intraName, blockedUserId: friend.intraName },
        });

        if (blockedByFriend) {
          throw new Error('The friend has blocked you.');
        }

        try {
          const newFriendship = await this.prisma.friends.create({
            data: {
              Users: { connect: { intraName: intraName } },
              FriendUsers: { connect: { intraName: friendname } },
              status: 'pending',
            },
          });

          return newFriendship;
        } catch (error) {
          return null;
        }
      }


    public async cancelRequest(intraName: string, friendname: string) {
        try {
            const user = await this.prisma.friends.deleteMany({
              where: {
                Users: { intraName },
                FriendUsers: { intraName: friendname },
                status: "pending",
              },
            });
            return user;
          } catch (e) {
            return false;
        }
    }

    public async acceptFriend(intraName: string, friendname: string) {

        try {
            let user = await this.prisma.friends.update({
                where: {
                    userId_friendUserId: {
                        userId: friendname,
                        friendUserId: intraName
                    }
                },
                data: {
                    status: "accepted"
                }
            });
            let user2 = await this.prisma.friends.create({
                data: {
                    Users: { connect: { intraName: intraName } },
                    FriendUsers: { connect: { intraName: friendname } },
                    status:    "accepted"
                },
            });
            return [user, user2];
        }
        catch (e) {
            return null;
        }
    }

    public async rejectFriend(intraName: string, friendname: string) {
        try {
            let user = await this.prisma.friends.delete({
                where: {
                    userId_friendUserId: {
                        userId: friendname,
                        friendUserId: intraName
                    }
                }
            });
            return true
        } catch (e) {
            return false;
        }
    }



    public async myFriends(intraName: string) {
        try {
            const friendlist =  await this.prisma.user.findMany({
                where: {
                    intraName: intraName
                },
                select: {
                    userFriends: {
                        where: {
                            status: "accepted"
                        },
                        select: {
                            FriendUsers: {
                                select: {
                                    intraName: true,
                                    avatar: true
                                },
                            },
                        }
                    }
                }
            });
            const friends = friendlist[0].userFriends
              .filter((friend) => friend.FriendUsers.intraName !== intraName)
              .map((friend) => ({
                intraName: friend.FriendUsers.intraName,
                avatar: friend.FriendUsers.avatar,
            }));
            return friends;
        } catch (e: any) {
            try {
                const friendlist =  await this.prisma.user.findMany({
                    where: {
                        username: intraName
                    },
                    select: {
                        userFriends: {
                            where: {
                                status: "accepted"
                            },
                            select: {
                                FriendUsers: {
                                    select: {
                                        intraName: true,
                                        avatar: true
                                    },
                                },
                            }
                        }
                    }
                });
                const friends = friendlist[0].userFriends
                .filter((friend) => friend.FriendUsers.intraName !== intraName)
                .map((friend) => ({
                  intraName: friend.FriendUsers.intraName,
                  avatar: friend.FriendUsers.avatar,
              }));
              return friends;
            } catch (e: any ) {
                return (null);
            }
        }
    }

    public async myRequests(intraName: string) {
        return await this.prisma.friends.findMany({
            where: {
                friendUserId: intraName,
                status: "pending",
                userId: { not: intraName }
            },
            select: {
                userId: true,
            }
        });
    }


    public async myBlocked(intraName: string) {
        const currentUser = await this.prisma.user.findUnique({
          where: { intraName: intraName },
          include: {
            blocking: true,
            blockedBy: true,
          },
        });
        const blockedUsernames = currentUser.blocking.map((user) => user.blockedUserId);
        const blockedByUsernames = currentUser.blockedBy.map((user) => user.blockingUserId);
        return { blockedUsernames, blockedByUsernames };
    }

    public async deleteFriend(intraName: string, friendname: string) {
        try {
            const friendUser = await this.prisma.user.findFirst({
                where: {
                  OR: [
                    { username: friendname },
                    { intraName: friendname }
                  ]
                }
              });
            friendname = friendUser.intraName;
            let user = await this.prisma.friends.delete({
                where: {
                    userId_friendUserId: {
                        userId: intraName,
                        friendUserId: friendname
                    }
                }
            });
            let user2 = await this.prisma.friends.delete({
                where: {
                    userId_friendUserId: {
                        userId: friendname,
                        friendUserId: intraName
                    }
                }
            });

            return user;
        }
        catch (e) {
            return null;
        }
    }

    public async isFriend(intraName: string, friendname: string) {
        const friend = await this.prisma.friends.findUnique({
            where: {
                userId_friendUserId: {
                    userId: intraName,
                    friendUserId: friendname
                }
            }
        });
        if (friend) {
            return [true, friend.status];
        }
        return [false, null];
    }

    async findUser(intraName: string): Promise<string | null> {
        if (!intraName || intraName === '' || intraName === null)
            return null;
        const user = await this.prisma.user.findUnique({
            where: {
                intraName: intraName
            },
            select: {
                intraName: true,
            }
        });
        if (user && user.intraName === intraName) {
            return intraName;
        }
        else {
            const user = await this.prisma.user.findUnique({
                where: {
                    username: intraName
                },
                select: {
                    intraName: true,
                }
            });
            if (user) {
                return user.intraName;
            }
            else {
                return null;
            }
        }
    }

    public async isBlocked(intraName: string, friendname: string) {
        const friendIntraName = await this.findUser(friendname);
        if (friendIntraName === null)
            throw("Not found");
        let friend = await this.prisma.friends.findUnique({
            where: {
                userId_friendUserId: {
                    userId: friendIntraName,
                    friendUserId: intraName
                }
            }
        });
        if (friend === null) {
            friend = await this.prisma.friends.findUnique({
                where: {
                    userId_friendUserId: {
                        userId: intraName,
                        friendUserId: friendIntraName
                    }
                }
            });
        }
        if (friend && friend.status == "blocked") {
            return true;
        }
        return false;
    }


    public async isBlockedd(intraName: string, friendName: string): Promise<boolean> {
        const blockingUser = await this.prisma.user.findUnique({
          where: { intraName: friendName },
          include: { blockedBy: { select: { blockingUserId: true } } },
        });

        if (!blockingUser) {
          throw new Error('Friend user not found.');
        }

        const isBlocked = blockingUser.blockedBy.some((blockedUser) => blockedUser.blockingUserId === intraName);

        return isBlocked;
      }

    public async blockedYou(intraName:string, friendUserName: string) {
        const blockingUser = await this.prisma.user.findUnique({
            where: { intraName: friendUserName },
            include: { blocking: { select: { blockedUserId: true } } },
          });

          if (!blockingUser) {
            throw new Error('Friend user not found.');
          }

          const isBlocked = blockingUser.blocking.some((blockedUser) => blockedUser.blockedUserId === intraName);

        return isBlocked;
    }



    public async blockUserr(intraName: string, friendName: string) {
        const user = await this.prisma.user.findUnique({ where: { intraName } });
        const friend = await this.prisma.user.findUnique({ where: { intraName: friendName } });

        if (!user || !friend) {
          throw new Error('User or friend not found.');
        }

        // Check if the block relationship already exists
        const existingBlock = await this.prisma.blockedUser.findFirst({
          where: {
            OR: [
              { blockingUserId: intraName, blockedUserId: friendName },
              { blockingUserId: friendName, blockedUserId: intraName },
            ],
          },
        });

        if (existingBlock) {
          throw new Error('The user is already blocked by the friend.');
        }

        // Create the block relationship
        await this.prisma.blockedUser.create({
          data: {
            blockingUserId: user.intraName,
            blockedUserId: friend.intraName,
          },
        });

        this.deleteFriend(intraName, friendName)

        return true;
      }




    // public async unblockUser(intraName: string, friendname: string) {
    //     try {
    //         const user = await this.prisma.friends.deleteMany({
    //           where: {
    //             Users: { intraName },
    //             FriendUsers: { intraName: friendname },
    //             status: "blocked",
    //           },
    //         });
    //         return user;
    //       } catch (e) {
    //         return false;
    //     }
    // }


    public async unblockUserr(intraName: string, friendName: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { intraName } });
        const friend = await this.prisma.user.findUnique({ where: { intraName: friendName } });

        if (!user || !friend) {
          throw new Error('User or friend not found.');
        }

        // Check if the block relationship exists
        const existingBlock = await this.prisma.blockedUser.findFirst({
          where: {
            OR: [
                { blockingUserId: intraName, blockedUserId: friendName },
                { blockingUserId: friendName, blockedUserId: intraName },
            ],
          },
        });

        if (!existingBlock) {
          throw new Error('The user is not blocked by the friend.');
        }

        // Delete the block relationship
        await this.prisma.blockedUser.delete({ where: { id: existingBlock.id } });

        return true;
      }

}
