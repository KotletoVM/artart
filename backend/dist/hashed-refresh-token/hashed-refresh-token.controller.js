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
exports.HashedRefreshTokenController = void 0;
const common_1 = require("@nestjs/common");
const hashed_refresh_token_service_1 = require("./hashed-refresh-token.service");
let HashedRefreshTokenController = class HashedRefreshTokenController {
    constructor(hashedRefreshTokenService) {
        this.hashedRefreshTokenService = hashedRefreshTokenService;
    }
};
HashedRefreshTokenController = __decorate([
    (0, common_1.Controller)('hashed-refresh-token'),
    __metadata("design:paramtypes", [hashed_refresh_token_service_1.HashedRefreshTokenService])
], HashedRefreshTokenController);
exports.HashedRefreshTokenController = HashedRefreshTokenController;
//# sourceMappingURL=hashed-refresh-token.controller.js.map