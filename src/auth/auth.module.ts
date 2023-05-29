import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "src/configs/constants";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: {
        expiresIn: "15m",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
