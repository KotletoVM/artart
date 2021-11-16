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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const emailConfirmation_guard_1 = require("../auth/guards/emailConfirmation.guard");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    create(req, createCommentDto, personid) {
        return this.commentService.create(createCommentDto, req.user.id, personid);
    }
    findAllforPerson(personid) {
        return this.commentService.findAllforPerson(personid);
    }
    findAll() {
        return this.commentService.findAll();
    }
    async findOne(id) {
        const find = await this.commentService.findOne(+id);
        if (!find) {
            throw new common_1.NotFoundException('Comment not found.');
        }
        return this.commentService.findOne(+id);
    }
    async update(id, updateCommentDto, req) {
        const find = await this.commentService.findOne(+id);
        if (!find) {
            throw new common_1.NotFoundException('Comment not found.');
        }
        else if (find.user.id != req.user.id) {
            throw new common_1.ForbiddenException('Its not your comment');
        }
        return this.commentService.update(+id, updateCommentDto);
    }
    async remove(id, req) {
        const find = await this.commentService.findOne(+id);
        if (!find) {
            throw new common_1.NotFoundException('Comment not found.');
        }
        else if (find.user.id != req.user.id) {
            throw new common_1.ForbiddenException('Its not your comment');
        }
        return this.commentService.remove(+id);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, emailConfirmation_guard_1.EmailConfirmationGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('personid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_comment_dto_1.CreateCommentDto, Number]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('personid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "findAllforPerson", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, emailConfirmation_guard_1.EmailConfirmationGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_dto_1.UpdateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, emailConfirmation_guard_1.EmailConfirmationGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "remove", null);
CommentController = __decorate([
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map