"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaintingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_painting_dto_1 = require("./create-painting.dto");
class UpdatePaintingDto extends (0, mapped_types_1.PartialType)(create_painting_dto_1.CreatePaintingDto) {
}
exports.UpdatePaintingDto = UpdatePaintingDto;
//# sourceMappingURL=update-painting.dto.js.map