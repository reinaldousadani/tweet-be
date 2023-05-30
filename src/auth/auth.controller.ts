import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserLoginDto } from "./dto/user-login.dto";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
