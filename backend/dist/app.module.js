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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const person_module_1 = require("./person/person.module");
const comment_module_1 = require("./comment/comment.module");
const auth_module_1 = require("./auth/auth.module");
const music_module_1 = require("./music/music.module");
const art_module_1 = require("./art/art.module");
const event_module_1 = require("./event/event.module");
const tag_module_1 = require("./tag/tag.module");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const database_config_1 = require("./config/database.config");
const hashed_refresh_token_module_1 = require("./hashed-refresh-token/hashed-refresh-token.module");
const email_confirmation_module_1 = require("./email-confirmation/email-confirmation.module");
let AppModule = class AppModule {
    constructor(configService) {
        this.configService = configService;
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true, load: [configuration_1.config] }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useClass: database_config_1.DatabaseConfig,
            }),
            user_module_1.UserModule,
            person_module_1.PersonModule,
            comment_module_1.CommentModule,
            auth_module_1.AuthModule,
            music_module_1.MusicModule,
            art_module_1.ArtModule,
            event_module_1.EventModule,
            tag_module_1.TagModule,
            hashed_refresh_token_module_1.HashedRefreshTokenModule,
            email_confirmation_module_1.EmailConfirmationModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map