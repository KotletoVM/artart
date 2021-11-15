"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHashedRefreshTokenDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_hashed_refresh_token_dto_1 = require("./create-hashed-refresh-token.dto");
class UpdateHashedRefreshTokenDto extends (0, mapped_types_1.PartialType)(create_hashed_refresh_token_dto_1.CreateHashedRefreshTokenDto) {
}
exports.UpdateHashedRefreshTokenDto = UpdateHashedRefreshTokenDto;
//# sourceMappingURL=update-hashed-refresh-token.dto.js.map