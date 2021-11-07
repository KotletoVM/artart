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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/entities/user.entity");
const create_user_dto_1 = require("../user/dto/create-user.dto");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const hash = await bcrypt.hash(password, 10);
        const user = await this.userService.findByCond({
            email
        });
        if (user) {
            if (await bcrypt.compare(password, user.hash)) {
                const { hash } = user, result = __rest(user, ["hash"]);
                return result;
            }
            return null;
        }
        else {
            throw new common_1.ForbiddenException("User was not found.");
        }
    }
    generateJwtToken(data) {
        const payload = { email: data.email, sub: data.id };
        return this.jwtService.sign(payload);
    }
    async generateHash(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        return Object.assign(Object.assign({}, payload), { token: this.generateJwtToken(user) });
    }
    async register(createUserDto) {
        try {
            createUserDto.password = await this.generateHash(createUserDto.password);
            const _a = await this.userService.create(createUserDto), { hash } = _a, user = __rest(_a, ["hash"]);
            return {
                user,
                token: this.generateJwtToken(user)
            };
        }
        catch (e) {
            throw new common_1.ForbiddenException(e);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map