"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const user_entity_1 = require("../user/entities/user.entity");
const person_entity_1 = require("../person/entities/person.entity");
const art_entity_1 = require("../art/entities/art.entity");
const music_entity_1 = require("../music/entities/music.entity");
const tag_entity_1 = require("../tag/entities/tag.entity");
const event_entity_1 = require("../event/entities/event.entity");
const comment_entity_1 = require("../comment/entities/comment.entity");
const config = () => ({
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [user_entity_1.User, person_entity_1.Person, comment_entity_1.Comment, art_entity_1.Art, music_entity_1.Music, event_entity_1.Event, tag_entity_1.Tag],
        synchronize: true
    }
});
exports.config = config;
//# sourceMappingURL=configuration.js.map