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
const comment_entity_1 = require("../comment/entities/comment.entity");
const jwt_decode_1 = require("jwt-decode");
const comment_service_1 = require("../comment/comment.service");
let PersonService = class PersonService {
    constructor(personRepository, artRepository, musicRepository, commentRepository, commentService) {
        this.personRepository = personRepository;
        this.artRepository = artRepository;
        this.musicRepository = musicRepository;
        this.commentRepository = commentRepository;
        this.commentService = commentService;
    }
    async create(createPersonDto) {
        const qb = this.personRepository.createQueryBuilder('person');
        const _a = await qb.insert().values(createPersonDto).execute(), { identifiers, raw } = _a, person = __rest(_a, ["identifiers", "raw"]);
        const tags = await qb.relation(person_entity_1.Person, "tags").of(identifiers).add(createPersonDto.tags);
        return person;
    }
    async setLike(userid, personid) {
        const qb = this.personRepository.createQueryBuilder('person');
        let person = await this.personRepository.findOne(personid);
        if (!person) {
            throw new common_1.NotFoundException('person not found.');
        }
        try {
            const liked = await qb.relation(person_entity_1.Person, "liked_by").of(personid).add(userid);
        }
        catch (e) {
            throw new common_1.ForbiddenException('user can set only one like per person.');
        }
        return this.personRepository.update(personid, { views: person.views + 1, likes: person.likes + 1 });
        ;
    }
    async findAll(req, take = 10, skip = 0) {
        const currentUserId = await this.isAuth(req);
        if (!currentUserId) {
            const qb = this.personRepository.createQueryBuilder('person');
            const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").take(take).skip(skip).orderBy("person.createdAt", "DESC").getManyAndCount();
            return [persons, count];
        }
        const qb = this.personRepository.createQueryBuilder('person');
        const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person", "user.id", "user.name"]).orderBy("person.createdAt", "DESC").take(take).skip(skip).getManyAndCount();
        return [this.setLikedforCurrentUser(currentUserId, persons), count];
    }
    async getPopular(req, take = 10, skip = 0) {
        const currentUserId = await this.isAuth(req);
        if (!currentUserId) {
            const qb = this.personRepository.createQueryBuilder('person');
            const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").orderBy('person.views', 'ASC').take(take).skip(skip).getManyAndCount();
            return [persons, count];
        }
        const qb = this.personRepository.createQueryBuilder('person');
        const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person", "user.id", "user.name"]).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
        return [this.setLikedforCurrentUser(currentUserId, persons), count];
    }
    async findByTag(req, tagid, take = 10, skip = 0) {
        const currentUserId = await this.isAuth(req);
        if (!currentUserId) {
            const qb = this.personRepository.createQueryBuilder('person');
            const qb1 = this.personRepository.createQueryBuilder('person');
            const personsWTagsId = await qb.leftJoinAndSelect("person.tags", "tag").select(["person.id", "person.views"]).where(`tag.id = :tag`, { tag: tagid }).take(take).skip(skip).orderBy('person.views', 'DESC').getMany();
            const personids = [];
            personsWTagsId.forEach(function (pers) {
                personids.push(pers.id);
            });
            const [persons, count] = await qb1.leftJoinAndSelect("person.tags", "tag").where(`person.id IN (:...personid)`, { personid: personids }).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
            return [persons, count];
        }
        const qb = this.personRepository.createQueryBuilder('person');
        const qb1 = this.personRepository.createQueryBuilder('person');
        const personsWTagsId = await qb.leftJoinAndSelect("person.tags", "tag").select(["person.id", "person.views"]).where(`tag.id = :tag`, { tag: tagid }).take(take).skip(skip).orderBy('person.views', 'DESC').getMany();
        const personids = [];
        personsWTagsId.forEach(function (pers) {
            personids.push(pers.id);
        });
        const [persons, count] = await qb1.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["user.id", "user.name"]).where(`person.id IN (:...personid)`, { personid: personids }).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
        return [this.setLikedforCurrentUser(currentUserId, persons), count];
    }
    async findOne(req, id) {
        const currentUserId = await this.isAuth(req);
        if (!currentUserId) {
            const qb = this.personRepository.createQueryBuilder('person');
            const person = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.personArt", "art").leftJoin("person.personMusic", "music").where("person.id = :id", { id: id }).getOne();
            return person;
        }
        const qb = this.personRepository.createQueryBuilder('person');
        const person = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").leftJoin("person.personArt", "art").leftJoin("person.personMusic", "music").addSelect(["user.id", "user.name"]).where("person.id = :id", { id: id }).getOne();
        this.personRepository.update(id, { views: person.views + 1 });
        return this.setLikedforCurrentUser(currentUserId, [person]);
    }
    async findOneSimple(id) {
        return this.personRepository.findOne(id);
    }
    async findUsersFavorite(id, take = 10, skip = 0) {
        const qb = this.personRepository.createQueryBuilder('person');
        const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["user.id", "user.name"]).where(`user.id = :id`, { id: id }).take(take).skip(skip).orderBy('person.views', 'DESC').getManyAndCount();
        return [this.setLikedforCurrentUser(id, persons), count];
    }
    async search(searchPersonDto, take = 10, skip = 0) {
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
        let [persons, number] = await qb.take(take).skip(skip).getManyAndCount();
        return { persons, number };
    }
    update(id, updatePersonDto) {
        console.log(updatePersonDto);
        return this.personRepository.update(id, updatePersonDto);
    }
    async remove(id) {
        const qb = this.personRepository.createQueryBuilder('person');
        this.artRepository.delete({ personid: id });
        this.musicRepository.delete({ personid: id });
        this.commentRepository.delete({ person: { id: id } });
        return this.personRepository.delete(id);
    }
    async findMusicians() {
        const qb = this.personRepository.createQueryBuilder('person');
        return qb.innerJoinAndSelect("person.personMusic", "music").getMany();
    }
    async findArtists() {
        const qb = this.personRepository.createQueryBuilder('person');
        return qb.innerJoinAndSelect("person.personArt", "art").getMany();
    }
    setLikedforCurrentUser(currentUserId, persons) {
        try {
            persons.forEach(person => {
                person.liked_by.forEach(like => {
                    if (like.id == currentUserId) {
                        person.liked = true;
                        return;
                    }
                });
            });
            return persons;
        }
        catch (e) {
            throw new common_1.NotFoundException('persons not found.');
        }
    }
    async isAuth(req) {
        if (!req.cookies['access_token'])
            return false;
        const decodedJwt = await (0, jwt_decode_1.default)(req.cookies['access_token']);
        return Number(decodedJwt['sub']);
    }
};
PersonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __param(1, (0, typeorm_1.InjectRepository)(art_entity_1.Art)),
    __param(2, (0, typeorm_1.InjectRepository)(music_entity_1.Music)),
    __param(3, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        comment_service_1.CommentService])
], PersonService);
exports.PersonService = PersonService;
//# sourceMappingURL=person.service.js.map