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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const person_entity_1 = require("./entities/person.entity");
const typeorm_2 = require("typeorm");
const music_entity_1 = require("../music/entities/music.entity");
const art_entity_1 = require("../art/entities/art.entity");
const tag_entity_1 = require("../tag/entities/tag.entity");
let PersonService = class PersonService {
    constructor(personRepository, artRepository, musicRepository) {
        this.personRepository = personRepository;
        this.artRepository = artRepository;
        this.musicRepository = musicRepository;
    }
    async create(createPersonDto) {
        const qb = this.personRepository.createQueryBuilder('person');
        const _a = await qb.insert().values(createPersonDto).execute(), { identifiers, raw } = _a, person = __rest(_a, ["identifiers", "raw"]);
        const tags = await qb.relation(person_entity_1.Person, "tags").of(identifiers).add(createPersonDto.tags);
        return person;
    }
    async findAll() {
        const qb = this.personRepository.createQueryBuilder('person');
        const [persons, count] = await qb.take(3).orderBy("person.createdAt", "DESC").getManyAndCount();
        return [persons, count];
    }
    async findArtists() {
        const qb = this.personRepository.createQueryBuilder('person');
        return qb.innerJoinAndSelect("person.personArt", "art").getMany();
    }
    async findMusicians() {
        const qb = this.personRepository.createQueryBuilder('person');
        return qb.innerJoinAndSelect("person.personMusic", "music").getMany();
    }
    async findOne(id) {
        let onePerson = await this.personRepository.findOne(id, { relations: ["personArt", "personMusic", "tags"] });
        if (onePerson)
            this.personRepository.update(id, { views: onePerson.views + 1 });
        return onePerson;
    }
    async getPopular() {
        const qb = this.personRepository.createQueryBuilder('popularQueryBuilder');
        qb.orderBy('views', 'DESC');
        qb.limit(10);
        let [persons, number] = await qb.getManyAndCount();
        return { persons, number };
    }
    async search(searchPersonDto) {
        const qb = this.personRepository.createQueryBuilder('searchQueryBuilder');
        if (searchPersonDto.views) {
            qb.orderBy('views', searchPersonDto.views);
        }
        if (searchPersonDto.description) {
            qb.andWhere(`searchQueryBuilder.description ILIKE :description`);
        }
        if (searchPersonDto.fullname) {
            qb.andWhere(`searchQueryBuilder.fullname ILIKE :fullname`);
        }
        if (searchPersonDto.pseudonym) {
            qb.andWhere(`searchQueryBuilder.pseudonym ILIKE :pseudonym`);
        }
        qb.setParameters({
            description: `%${searchPersonDto.description}%`,
            fullname: `%${searchPersonDto.fullname}%`,
            pseudonym: `%${searchPersonDto.pseudonym}%`
        });
        let [persons, number] = await qb.getManyAndCount();
        return { persons, number };
    }
    update(id, updatePersonDto) {
        return this.personRepository.update(id, updatePersonDto);
    }
    remove(id) {
        this.artRepository.delete({ personid: id });
        this.musicRepository.delete({ personid: id });
        return this.personRepository.delete(id);
    }
    async setLike(id) {
        let onePerson = await this.personRepository.findOne(id);
        this.personRepository.update(id, { views: onePerson.likes + 1 });
    }
};
PersonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __param(1, (0, typeorm_1.InjectRepository)(art_entity_1.Art)),
    __param(2, (0, typeorm_1.InjectRepository)(music_entity_1.Music)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PersonService);
exports.PersonService = PersonService;
//# sourceMappingURL=person.service.js.map