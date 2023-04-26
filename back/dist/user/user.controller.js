"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_3 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const auth_service_1 = require("../auth/auth.service");
let UserController = class UserController {
    constructor(userService, authService, jwtService) {
        this.userService = userService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async uploadAvatar(req, file) {
        if (!file) {
            throw new common_3.BadRequestException('No file uploaded');
        }
        if (!file.fieldname) {
            throw new common_3.BadRequestException('Missing filename');
        }
        const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        await this.userService.updateAvatar(url, req.user.id);
        return url;
    }
    async userData(req) {
        const userData = await this.authService.findByUsername(req.user.id);
        const neWuser = Object.assign(Object.assign({}, userData), { hash: undefined, access_token: undefined, twofa_secret: undefined });
        return (neWuser);
    }
    async add_displayName(req, body, res) {
        try {
            const displayName = body.displayName;
            const existingUser = await this.userService.findBydisplayName(displayName);
            if (existingUser) {
                return res.status(400).json({ message: 'Display name already exists' });
            }
            await this.userService.addDisplayName(displayName, req.user.id);
            res.status(200).json({ displayName });
        }
        catch (error) {
            console.error('Error Saving displayName :', error);
            res.status(500).send('Error Saving displayName');
        }
    }
};
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = (0, uuid_1.v4)().replace(/-/g, '');
                const extension = file.originalname.split('.').pop();
                cb(null, `${randomName}.${extension}`);
            },
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('data'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userData", null);
__decorate([
    (0, common_1.Post)('displayName'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "add_displayName", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map