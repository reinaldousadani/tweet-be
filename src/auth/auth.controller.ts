import { Body, Controller, Post } from "@nestjs/common";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  async login(@Body() loginDto: UserLoginDto) {
    try {
      const res = await this.userService.dangerousFindByUsername(
        loginDto.username
      );

      return res ? { ...res, password: "***" } : res;
    } catch (error) {
      throw error;
    }
  }
}
