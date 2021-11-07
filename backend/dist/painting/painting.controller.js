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
exports.PaintingController = void 0;
const common_1 = require("@nestjs/common");
const painting_service_1 = require("./painting.service");
const create_painting_dto_1 = require("./dto/create-painting.dto");
const update_painting_dto_1 = require("./dto/update-painting.dto");
let PaintingController = class PaintingController {
    constructor(paintingService) {
        this.paintingService = paintingService;
    }
    create(createPaintingDto) {
        return this.paintingService.create(createPaintingDto);
    }
    findAllforPerson(personid) {
        return this.paintingService.findAllforPerson(+personid);
    }
    findOne(id) {
        return this.paintingService.findOne(+id);
    }
    update(id, updatePaintingDto) {
        return this.paintingService.update(+id, updatePaintingDto);
    }
    remove(id) {
        return this.paintingService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_painting_dto_1.CreatePaintingDto]),
    __metadata("design:returntype", void 0)
], PaintingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('personid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaintingController.prototype, "findAllforPerson", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaintingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_painting_dto_1.UpdatePaintingDto]),
    __metadata("design:returntype", void 0)
], PaintingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaintingController.prototype, "remove", null);
PaintingController = __decorate([
    (0, common_1.Controller)('painting'),
    __metadata("design:paramtypes", [painting_service_1.PaintingService])
], PaintingController);
exports.PaintingController = PaintingController;
//# sourceMappingURL=painting.controller.js.map