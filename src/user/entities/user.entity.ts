import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "username" })
  username: string;

  @Column()
  password: string;
}
