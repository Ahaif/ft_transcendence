import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';



@Injectable()
export class AuthService {
    constructor (private prisma: PrismaService,
                private jwtService: JwtService) {}
    async login(req) {
        let isExisting: boolean = false;
    const isExist = await this.prisma.user.findUnique({
            where: {
                id: +req.user.id,
            }
        });


        if (!isExist || isExist === null || isExist === undefined) {
            await this.prisma.user.create({
                data: {
                    id: +req.user.id,
                    intraName: req.user.username,
                    email: req.user.emails[0].value,
                    username: req.user.username,
                    accessToken: req.user.accessToken,
                    refreshToken: req.user.refreshToken,
                    avatar: req.user.avatar,
                    coalition: req.user.coalition,
                    clCoverUrl: req.user.clCoverUrl,
                    clImageUrl: req.user.clImageUrl,
                    clColor: req.user.clColor,
                }
            });
        }
        else {
            await this.prisma.user.update({
                where: {
                    id: +req.user.id,
                },
                data: {
                    accessToken: req.user.accessToken,
                    refreshToken: req.user.refreshToken
                }
            });
            isExisting = true;
            if (isExist.otpEnabled === true) {
                return ({
                    access_token: this.jwtService.sign({
                                    user: req.user.username,
                                    id: req.user.id,
                                    otpEnabled: true,
                                    otpUnauthenticated: true
                                }),
                    isExisting: isExisting,
                    otpEnabled: true
                });
            }
        }
        return ({
            access_token: this.jwtService.sign({user: req.user.username, id: req.user.id, otpEnabled: false}),
            isExisting: isExisting,
            otpEnabled: false
        });
    }


    async validateJwt(payload: any): Promise<boolean> {
        try {
            this.jwtService.verify(payload)
        }
        catch (e) {
            return (false);
        }
        return (true);
    }

}
