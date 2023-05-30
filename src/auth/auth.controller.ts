import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { UserLoginDto } from "./dto/user-login.dto";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { LinksAssembler } from "src/commons/assemblers/links.assembler";
import { User } from "src/user/entities/user.entity";
import { constructApiResourceUrl } from "src/commons/utils/utils";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: UserLoginDto) {
    try {
      return this.authService.signIn(loginDto.username, loginDto.password);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      const user = await this.userService.create(createUserDto);
      return new LinksAssembler<User>(user, [
        {
          name: "self",
          targetUrl: constructApiResourceUrl(req, `user/${user.id}`),
        },
        {
          name: "users",
          targetUrl: constructApiResourceUrl(req, `users`),
        },
      ]).getObject();
    } catch (error) {
      throw error;
    }
  }
}
