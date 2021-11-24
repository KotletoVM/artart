import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

}
