"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonModule = void 0;
const common_1 = require("@nestjs/common");
const person_service_1 = require("./person.service");
const person_controller_1 = require("./person.controller");
const typeorm_1 = require("@nestjs/typeorm");
const person_entity_1 = require("./entities/person.entity");
const music_entity_1 = require("../music/entities/music.entity");
const art_entity_1 = require("../art/entities/art.entity");
const music_service_1 = require("../music/music.service");
let PersonModule = class PersonModule {
};
PersonModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([art_entity_1.Art]), typeorm_1.TypeOrmModule.forFeature([music_entity_1.Music]), typeorm_1.TypeOrmModule.forFeature([person_entity_1.Person])],
        controllers: [person_controller_1.PersonController],
        providers: [person_service_1.PersonService]
    })
], PersonModule);
exports.PersonModule = PersonModule;
//# sourceMappingURL=person.module.js.map