"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashedRefreshTokenModule = void 0;
const common_1 = require("@nestjs/common");
const hashed_refresh_token_service_1 = require("./hashed-refresh-token.service");
const hashed_refresh_token_controller_1 = require("./hashed-refresh-token.controller");
let HashedRefreshTokenModule = class HashedRefreshTokenModule {
};
HashedRefreshTokenModule = __decorate([
    (0, common_1.Module)({
        controllers: [hashed_refresh_token_controller_1.HashedRefreshTokenController],
        providers: [hashed_refresh_token_service_1.HashedRefreshTokenService]
    })
], HashedRefreshTokenModule);
exports.HashedRefreshTokenModule = HashedRefreshTokenModule;
//# sourceMappingURL=hashed-refresh-token.module.js.map