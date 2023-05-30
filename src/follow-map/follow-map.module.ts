import { Module } from "@nestjs/common";
import { FollowMapService } from "./follow-map.service";
import { FollowMapController } from "./follow-map.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowMap } from "./entities/follow-map.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FollowMap])],
  controllers: [FollowMapController],
  providers: [FollowMapService],
})
export class FollowMapModule {}
