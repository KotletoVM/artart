"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailConfirmationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_email_confirmation_dto_1 = require("./create-email-confirmation.dto");
class UpdateEmailConfirmationDto extends (0, mapped_types_1.PartialType)(create_email_confirmation_dto_1.CreateEmailConfirmationDto) {
}
exports.UpdateEmailConfirmationDto = UpdateEmailConfirmationDto;
//# sourceMappingURL=update-email-confirmation.dto.js.map