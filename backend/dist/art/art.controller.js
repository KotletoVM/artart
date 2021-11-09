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
exports.ArtController = void 0;
const common_1 = require("@nestjs/common");
const art_service_1 = require("./art.service");
const create_art_dto_1 = require("./dto/create-art.dto");
const update_art_dto_1 = require("./dto/update-art.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ArtController = class ArtController {
    constructor(artService) {
        this.artService = artService;
    }
    create(createArtDto) {
        return this.artService.create(createArtDto);
    }
    findAllforPerson(personid) {
        return this.artService.findAllforPerson(+personid);
    }
    findOne(id) {
        return this.artService.findOne(+id);
    }
    update(id, updateArtDto) {
        return this.artService.update(+id, updateArtDto);
    }
    remove(id) {
        return this.artService.remove(+id);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_art_dto_1.CreateArtDto]),
    __metadata("design:returntype", void 0)
], ArtController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('personid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArtController.prototype, "findAllforPerson", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArtController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_art_dto_1.UpdateArtDto]),
    __metadata("design:returntype", void 0)
], ArtController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArtController.prototype, "remove", null);
ArtController = __decorate([
    (0, common_1.Controller)('art'),
    __metadata("design:paramtypes", [art_service_1.ArtService])
], ArtController);
exports.ArtController = ArtController;
//# sourceMappingURL=art.controller.js.map