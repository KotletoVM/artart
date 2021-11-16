"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_module_1 = require("../user/user.module");
const local_strategy_1 = require("./strategies/local.strategy");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const typeorm_1 = require("@nestjs/typeorm");
const hashed_refresh_token_entity_1 = require("../hashed-refresh-token/entities/hashed-refresh-token.entity");
const user_entity_1 = require("../user/entities/user.entity");
const jwtRefreshToken_strategy_1 = require("./strategies/jwtRefreshToken.strategy");
const email_confirmation_module_1 = require("../email-confirmation/email-confirmation.module");
const emailConfirmation_strategy_1 = require("./strategies/emailConfirmation.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, passport_1.PassportModule, jwt_1.JwtModule.register({
                secret: "test",
                signOptions: { expiresIn: '30m' },
            }), typeorm_1.TypeOrmModule.forFeature([hashed_refresh_token_entity_1.HashedRefreshToken]), typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]), email_confirmation_module_1.EmailConfirmationModule],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, jwtRefreshToken_strategy_1.JwtRefreshTokenStrategy, emailConfirmation_strategy_1.EmailConfirmationStrategy]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map