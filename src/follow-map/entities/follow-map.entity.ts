import { User } from "src/user/entities/user.entity";
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class FollowMap {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.followMaps)
  @JoinColumn({ name: "user", referencedColumnName: "id" })
  user: string;

  @ManyToOne(() => User, (user) => user.followMaps)
  @JoinColumn({ name: "following", referencedColumnName: "id" })
  following: string;
}
