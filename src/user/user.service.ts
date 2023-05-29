import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Like, Repository } from "typeorm";
import { dataPerPage } from "src/configs/constants";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto).then((user) => {
      return { ...user, password: "***" };
    });
  }

  findMany(q: string, page: number) {
    return this.userRepository
      .findAndCount({
        where: [{ username: Like(`%${q}%`) }, { id: Like(`%${q}%`) }],
        skip: (page - 1) * dataPerPage,
        take: dataPerPage,
      })
      .then((res) => {
        res[0] = res[0].map((user) => {
          return { ...user, password: "***" };
        });

        return res;
      });
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id: id } }).then((res) => {
      return { ...res, password: "***" };
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
