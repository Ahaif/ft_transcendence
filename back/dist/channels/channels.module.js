"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsModule = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const channels_controller_1 = require("./channels.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth/auth.service");
const strategy_1 = require("../strategy");
const user_service_1 = require("../user/user.service");
let ChannelsModule = class ChannelsModule {
};
ChannelsModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), config_1.ConfigModule],
        controllers: [channels_controller_1.ChannelsController],
        providers: [channels_service_1.ChannelsService, auth_service_1.AuthService, strategy_1.JwtStrategy, user_service_1.UserService],
        exports: [channels_service_1.ChannelsService],
    })
], ChannelsModule);
exports.ChannelsModule = ChannelsModule;
//# sourceMappingURL=channels.module.js.map