import { Module } from "@nestjs/common";
import { TweetService } from "./tweet.service";
import { TweetController } from "./tweet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tweet } from "./entities/tweet.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  controllers: [TweetController],
  providers: [TweetService],
})
export class TweetModule {}
