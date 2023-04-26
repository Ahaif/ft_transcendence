"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const api_controller_1 = require("./api.controller");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const FortyTwoStrategy_1 = require("../strategy/FortyTwoStrategy");
const jwt_strategy_1 = require("../strategy/jwt.strategy");
const api_service_1 = require("./api.service");
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), config_1.ConfigModule],
        controllers: [api_controller_1.ApiController],
        providers: [api_service_1.ApiService, auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, FortyTwoStrategy_1.FortyTwoStrategy],
        exports: [api_service_1.ApiService],
    })
], ApiModule);
exports.ApiModule = ApiModule;
//# sourceMappingURL=api.module.js.map