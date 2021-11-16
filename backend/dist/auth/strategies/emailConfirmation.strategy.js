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
exports.EmailConfirmationStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/user.service");
const config_1 = require("@nestjs/config");
let EmailConfirmationStrategy = class EmailConfirmationStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'email-confirm') {
    constructor(userService, configService) {
        super({
            jwtFromRequest: (req) => {
                if (!req || !req.cookies)
                    return null;
                return req.cookies['refresh_token'];
            },
            ignoreExpiration: true,
            secretOrKey: configService.get('refresh_token.secret'),
        });
        this.userService = userService;
        this.configService = configService;
    }
    async validate(payload) {
        const data = { id: payload.sub, email: payload.email };
        const user = await this.userService.findByCond(data);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.isEmailConfirmed == false) {
            throw new common_1.UnauthorizedException('Confirm your email first');
        }
        return data;
    }
};
EmailConfirmationStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, config_1.ConfigService])
], EmailConfirmationStrategy);
exports.EmailConfirmationStrategy = EmailConfirmationStrategy;
//# sourceMappingURL=emailConfirmation.strategy.js.map