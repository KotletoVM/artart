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
exports.Person = void 0;
const typeorm_1 = require("typeorm");
const music_entity_1 = require("../../music/entities/music.entity");
const art_entity_1 = require("../../art/entities/art.entity");
const tag_entity_1 = require("../../tag/entities/tag.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let Person = class Person {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Person.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "fullname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "pseudonym", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'https://cdn4.vectorstock.com/i/1000x1000/84/68/hipster-man-in-glasses-avatar-profile-userpic-vector-8988468.jpg' }),
    __metadata("design:type", String)
], Person.prototype, "personpic", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Person.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Person.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Person.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Person.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], Person.prototype, "socNetworks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => art_entity_1.Art, art => art.personid),
    __metadata("design:type", Array)
], Person.prototype, "personArt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => music_entity_1.Music, music => music.personid),
    __metadata("design:type", Array)
], Person.prototype, "personMusic", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.Tag, { nullable: true, eager: true, cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: "person_tags"
    }),
    __metadata("design:type", Array)
], Person.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, { nullable: true, eager: true, cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: "person_likes"
    }),
    __metadata("design:type", Array)
], Person.prototype, "liked_by", void 0);
Person = __decorate([
    (0, typeorm_1.Entity)()
], Person);
exports.Person = Person;
//# sourceMappingURL=person.entity.js.map