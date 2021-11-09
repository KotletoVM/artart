"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtModule = void 0;
const common_1 = require("@nestjs/common");
const art_service_1 = require("./art.service");
const art_controller_1 = require("./art.controller");
const typeorm_1 = require("@nestjs/typeorm");
const art_entity_1 = require("./entities/art.entity");
let ArtModule = class ArtModule {
};
ArtModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([art_entity_1.Art])],
        controllers: [art_controller_1.ArtController],
        providers: [art_service_1.ArtService],
        exports: [art_service_1.ArtService]
    })
], ArtModule);
exports.ArtModule = ArtModule;
//# sourceMappingURL=art.module.js.map