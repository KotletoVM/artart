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
exports.PersonController = void 0;
const common_1 = require("@nestjs/common");
const person_service_1 = require("./person.service");
const create_person_dto_1 = require("./dto/create-person.dto");
const update_person_dto_1 = require("./dto/update-person.dto");
const search_person_dto_1 = require("./dto/search-person.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PersonController = class PersonController {
    constructor(personService) {
        this.personService = personService;
    }
    create(createPersonDto) {
        return this.personService.create(createPersonDto);
    }
    findAll() {
        return this.personService.findAll();
    }
    getPopular() {
        return this.personService.getPopular();
    }
    search(searchPersonDto) {
        return this.personService.search(searchPersonDto);
    }
    findArtists() {
        return this.personService.findArtists();
    }
    findMusicians() {
        return this.personService.findMusicians();
    }
    async findOne(id) {
        const find = await this.personService.findOne(+id);
        if (!find) {
            throw new common_1.NotFoundException('Person not found.');
        }
        return find;
    }
    async update(id, updatePersonDto) {
        const find = await this.personService.findOne(+id);
        if (!find) {
            throw new common_1.NotFoundException('Person not found.');
        }
        return this.personService.update(+id, updatePersonDto);
    }
    async remove(id) {
        const find = await this.personService.findOne(+id);
        if (!find) {
            throw new common_1.NotFoundException('Person not found.');
        }
        return this.personService.remove(+id);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_person_dto_1.CreatePersonDto]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('popular'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_person_dto_1.SearchPersonDto]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('artists'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findArtists", null);
__decorate([
    (0, common_1.Get)('musicians'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findMusicians", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_person_dto_1.UpdatePersonDto]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "remove", null);
PersonController = __decorate([
    (0, common_1.Controller)('person'),
    __metadata("design:paramtypes", [person_service_1.PersonService])
], PersonController);
exports.PersonController = PersonController;
//# sourceMappingURL=person.controller.js.map