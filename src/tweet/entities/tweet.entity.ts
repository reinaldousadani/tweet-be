import { User } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.tweets)
  user: User;
}
