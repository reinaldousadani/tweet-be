import { Injectable } from "@nestjs/common";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { UpdateTweetDto } from "./dto/update-tweet.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tweet } from "./entities/tweet.entity";
import { Like, Repository } from "typeorm";
import { dataPerPage } from "src/configs/constants";
import { JwtPayload } from "src/auth/dto/jwt-payload";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>
  ) {}

  create(createTweetDto: CreateTweetDto & { user: JwtPayload }) {
    const newTweet = new Tweet();
    const user = new User();
    newTweet.content = createTweetDto.content;
    user.id = createTweetDto.user.sub;
    user.username = createTweetDto.user.username;
    user.password = "***";
    newTweet.user = user;
    return this.tweetRepository.save(newTweet);
  }

  async findMany(q: string, page: number) {
    return this.tweetRepository
      .findAndCount({
        where: [{ content: Like(`%${q}%`) }, { id: Like(`%${q}%`) }],
        skip: (page - 1) * dataPerPage,
        take: dataPerPage,
        relations: ["user"],
      })
      .then((res) => {
        res[0] = res[0].map((tweet) => {
          return { ...tweet, user: { ...tweet.user, password: "***" } };
        });
        return res;
      });
  }

  async findOne(id: string) {
    return this.tweetRepository
      .findOne({
        where: { id },
        relations: ["user"],
      })
      .then((res) => {
        if (res === null) {
          return res;
        } else {
          return { ...res, user: { ...res.user, password: "***" } };
        }
      });
  }

  update(id: string, updateTweetDto: UpdateTweetDto) {
    return this.tweetRepository.update({ id }, updateTweetDto);
  }

  remove(id: string) {
    return this.tweetRepository.delete({ id });
  }
}
