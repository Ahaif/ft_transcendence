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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortyTwoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const auth_service_1 = require("../auth/auth.service");
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(authService) {
        super({
            clientID: 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f',
            clientSecret: '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',
            callbackURL: 'http://10.11.1.1:3000/auth/dashboard',
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, cb) {
        const user = await this.authService.findOrCreateUser(profile, accessToken);
        const neWuser = Object.assign(Object.assign({ id: 0 }, user), { displayName: profile.displayName, hash: undefined, access_token: undefined, twofa_secret: undefined });
        cb(null, neWuser);
    }
};
FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FortyTwoStrategy);
exports.FortyTwoStrategy = FortyTwoStrategy;
//# sourceMappingURL=FortyTwoStrategy.js.map