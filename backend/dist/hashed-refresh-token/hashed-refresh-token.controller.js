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
exports.HashedRefreshTokenController = void 0;
const common_1 = require("@nestjs/common");
const hashed_refresh_token_service_1 = require("./hashed-refresh-token.service");
const create_hashed_refresh_token_dto_1 = require("./dto/create-hashed-refresh-token.dto");
const update_hashed_refresh_token_dto_1 = require("./dto/update-hashed-refresh-token.dto");
let HashedRefreshTokenController = class HashedRefreshTokenController {
    constructor(hashedRefreshTokenService) {
        this.hashedRefreshTokenService = hashedRefreshTokenService;
    }
    create(createHashedRefreshTokenDto) {
        return this.hashedRefreshTokenService.create(createHashedRefreshTokenDto);
    }
    findAll() {
        return this.hashedRefreshTokenService.findAll();
    }
    findOne(id) {
        return this.hashedRefreshTokenService.findOne(+id);
    }
    update(id, updateHashedRefreshTokenDto) {
        return this.hashedRefreshTokenService.update(+id, updateHashedRefreshTokenDto);
    }
    remove(id) {
        return this.hashedRefreshTokenService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hashed_refresh_token_dto_1.CreateHashedRefreshTokenDto]),
    __metadata("design:returntype", void 0)
], HashedRefreshTokenController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HashedRefreshTokenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HashedRefreshTokenController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hashed_refresh_token_dto_1.UpdateHashedRefreshTokenDto]),
    __metadata("design:returntype", void 0)
], HashedRefreshTokenController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HashedRefreshTokenController.prototype, "remove", null);
HashedRefreshTokenController = __decorate([
    (0, common_1.Controller)('hashed-refresh-token'),
    __metadata("design:paramtypes", [hashed_refresh_token_service_1.HashedRefreshTokenService])
], HashedRefreshTokenController);
exports.HashedRefreshTokenController = HashedRefreshTokenController;
//# sourceMappingURL=hashed-refresh-token.controller.js.map