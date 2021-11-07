"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user/entities/user.entity");
const person_module_1 = require("./person/person.module");
const person_entity_1 = require("./person/entities/person.entity");
const comment_module_1 = require("./comment/comment.module");
const comment_entity_1 = require("./comment/entities/comment.entity");
const auth_module_1 = require("./auth/auth.module");
const painting_module_1 = require("./painting/painting.module");
const painting_entity_1 = require("./painting/entities/painting.entity");
const music_module_1 = require("./music/music.module");
const music_entity_1 = require("./music/entities/music.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 8000,
                username: 'artart',
                password: 'misteries',
                database: 'ArtArt',
                entities: [user_entity_1.User, person_entity_1.Person, comment_entity_1.Comment, painting_entity_1.Painting, music_entity_1.Music],
                synchronize: true
            }),
            user_module_1.UserModule,
            person_module_1.PersonModule,
            comment_module_1.CommentModule,
            auth_module_1.AuthModule,
            painting_module_1.PaintingModule,
            music_module_1.MusicModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map