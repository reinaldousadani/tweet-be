import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmConfigModule } from "./configs/typeorm-config.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserModule } from './user/user.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from "./auth/auth.module";
import { FollowMapModule } from './follow-map/follow-map.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const typeormConfig = new TypeOrmConfigModule(new ConfigService());
        console.log("🚀 ~ typeormConfig:", typeormConfig);
        return typeormConfig.typeOrmAsyncConfig;
      },
      dataSourceFactory: async (options) => {
        console.log("🚀 ~ dataSourceFactory: ~ options:", options);
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UserModule,
    TweetModule,
    AuthModule,
    FollowMapModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
