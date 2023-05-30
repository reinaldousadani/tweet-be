import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { JwtPayload } from "./dto/jwt-payload";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, password: string) {
    try {
      const res = await this.userService.dangerousFindByUsername(username);
      if (res?.password !== password) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = { sub: res.id, username: res.username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
