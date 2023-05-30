import { FollowMap } from "src/follow-map/entities/follow-map.entity";
import { Tweet } from "src/tweet/entities/tweet.entity";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "username" })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Tweet, (tweet) => tweet.user, { cascade: true })
  tweets: Tweet[];

  @OneToMany(() => FollowMap, (followMap) => followMap.user, { cascade: true })
  followMaps: FollowMap[];
}
