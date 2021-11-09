"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArtDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_art_dto_1 = require("./create-art.dto");
class UpdateArtDto extends (0, mapped_types_1.PartialType)(create_art_dto_1.CreateArtDto) {
}
exports.UpdateArtDto = UpdateArtDto;
//# sourceMappingURL=update-art.dto.js.map