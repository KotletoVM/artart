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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hashed_refresh_token_entity_1 = require("../hashed-refresh-token/entities/hashed-refresh-token.entity");
const create_hashed_refresh_token_dto_1 = require("../hashed-refresh-token/dto/create-hashed-refresh-token.dto");
let AuthService = class AuthService {
    constructor(userService, jwtService, tokenRepository, userRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
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
    generateJwtAccessToken(data) {
        const payload = { email: data.email, sub: data.id };
        return this.jwtService.sign(payload);
    }
    generateJwtRefreshToken(data, secret, expiresIn) {
        const payload = { email: data.email, sub: data.id };
        return this.jwtService.sign(payload, { expiresIn: expiresIn + 'd', secret: secret });
    }
    async generateHash(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
    async login(user, response) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.generateJwtAccessToken(user);
        const refreshToken = this.generateJwtRefreshToken(user, 'qwerty', 30);
        const token = await bcrypt.hash(refreshToken, 10);
        this.saveRefreshToken({ userid: user.id, token: token });
        response.cookie('access_token', accessToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
        }).cookie('refresh_token', refreshToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
        }).send({ success: payload });
        return payload;
        ;
    }
    saveRefreshToken(createHashedRefreshTokenDto) {
        this.tokenRepository.save({ userid: createHashedRefreshTokenDto.userid, token: createHashedRefreshTokenDto.token });
    }
    async register(createUserDto, response) {
        try {
            createUserDto.password = await this.generateHash(createUserDto.password);
            const _a = await this.userService.create(createUserDto), { hash } = _a, user = __rest(_a, ["hash"]);
            const accessToken = this.generateJwtAccessToken(user);
            const refreshToken = this.generateJwtRefreshToken(user, 'qwerty', 30);
            const token = await bcrypt.hash(refreshToken, 10);
            this.saveRefreshToken({ userid: user.id, token: token });
            response.cookie('access_token', accessToken, {
                httpOnly: true,
                domain: 'localhost',
                expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
            }).cookie('refresh_token', refreshToken, {
                httpOnly: true,
                domain: 'localhost',
                expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
            }).send({ success: user });
        }
        catch (e) {
            throw new common_1.ForbiddenException(e);
        }
    }
    getCookieWithJwtAccessToken(user, response) {
        const accessToken = this.generateJwtAccessToken(user);
        response.cookie('access_token', accessToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(Date.now() + 20000 * 60 * 60 * 24)
        }).send({ success: [user.name, user.email] });
    }
    async getUserIfRefreshTokenMatches(refreshToken, userid) {
        const token = await this.tokenRepository.find({ userid: userid });
        let isRefreshTokenMatching = false;
        token.forEach(element => {
            if (bcrypt.compare(refreshToken, element.token)) {
                isRefreshTokenMatching = true;
                return isRefreshTokenMatching;
            }
        });
        if (isRefreshTokenMatching) {
            const user = await this.userRepository.findOne({ id: userid });
            return user;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(hashed_refresh_token_entity_1.HashedRefreshToken)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map