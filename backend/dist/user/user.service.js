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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
const hashed_refresh_token_entity_1 = require("../hashed-refresh-token/entities/hashed-refresh-token.entity");
let UserService = class UserService {
    constructor(userRepository, tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }
    create(createUserDto) {
        return this.userRepository.save({
            name: createUserDto.name,
            email: createUserDto.email,
            hash: createUserDto.password,
            userpic: createUserDto.userpic
        });
    }
    findAll() {
        return this.userRepository.find();
    }
    findById(id) {
        return this.userRepository.findOne(id);
    }
    findByEmail(email) {
        return this.userRepository.findOne({ email: email });
    }
    async search(searchUserDto) {
        const qb = this.userRepository.createQueryBuilder('searchQueryBuilder');
        if (searchUserDto.name) {
            qb.andWhere(`searchQueryBuilder.name ILIKE :name`);
        }
        if (searchUserDto.email) {
            qb.andWhere(`searchQueryBuilder.email ILIKE :email`);
        }
        qb.setParameters({
            name: `%${searchUserDto.name}%`,
            email: `%${searchUserDto.email}%`
        });
        let [users, number] = await qb.getManyAndCount();
        return { users, number };
    }
    findByCond(cond) {
        return this.userRepository.findOne(cond);
    }
    async getProfile(id) {
        const qb = this.userRepository.createQueryBuilder('user');
        const user = await qb.select(["user.id", "user.name", "user.userpic", "user.email", "user.createdAt", "user.updatedAt"]).where("user.id = :id", { id: id }).getOne();
        return user;
    }
    update(id, updateUserDto) {
        return this.userRepository.update(id, updateUserDto);
    }
    async updatePassword(id, updateUserPasswordDto) {
        const hash = await bcrypt.hash(updateUserPasswordDto.password, 10);
        return this.userRepository.update(id, { hash: hash });
    }
    async updateEmail(id, updateUserEmailDto) {
        return this.userRepository.update(id, { email: updateUserEmailDto.email });
    }
    async updateRole(id, updateUserRoleDto) {
        return this.userRepository.update(id, { role: updateUserRoleDto.role });
    }
    async remove(id) {
        this.tokenRepository.delete({ userid: id });
        return this.userRepository.delete(id);
    }
    async markEmailAsConfirmed(email) {
        return this.userRepository.update({ email: email }, {
            isEmailConfirmed: true
        });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(hashed_refresh_token_entity_1.HashedRefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map