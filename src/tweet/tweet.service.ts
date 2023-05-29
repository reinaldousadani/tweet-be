import { Injectable } from "@nestjs/common";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { UpdateTweetDto } from "./dto/update-tweet.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tweet } from "./entities/tweet.entity";
import { Like, Repository } from "typeorm";
import { dataPerPage } from "src/configs/constants";

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>
  ) {}

  create(createTweetDto: CreateTweetDto) {
    return "This action adds a new tweet";
  }

  async findMany(q: string, page: number) {
    return this.tweetRepository.findAndCount({
      where: [{ content: Like(`%${q}%`) }, { id: Like(`%${q}%`) }],
      skip: (page - 1) * dataPerPage,
      take: dataPerPage,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
