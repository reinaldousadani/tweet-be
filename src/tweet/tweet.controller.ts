import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TweetService } from "./tweet.service";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { UpdateTweetDto } from "./dto/update-tweet.dto";
import { Request } from "express";
import {
  analyzeNextPage,
  analyzePrevPage,
  constructApiResourceUrl,
  isNumericString,
} from "src/commons/utils/utils";
import { PaginatedResultAssembler } from "src/commons/assemblers/paginated-result.assembler";
import { LinksAssembler } from "src/commons/assemblers/links.assembler";
import { Tweet } from "./entities/tweet.entity";
import * as qs from "qs";
import { dataPerPage } from "src/configs/constants";
import { AuthGuard } from "src/auth/auth.guard";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("tweet")
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  create(@Body() createTweetDto: CreateTweetDto, @Req() req: Request) {
    console.log("🚀 ~ TweetController ~ create ~ req:", req);
    // return this.tweetService.create(createTweetDto);
    return `Hello`;
  }

  @Public()
  @Get()
  async findMany(
    @Query("q") q: string,
    @Query("page") page: string,
    @Req() req: Request
  ) {
    q = typeof q === "undefined" ? "" : q;
    page = typeof page === "undefined" || !isNumericString(page) ? "1" : page;
    try {
      const result = await this.tweetService.findMany(q, parseInt(page));

      const responseObject = new PaginatedResultAssembler(
        result[1],
        analyzeNextPage(parseInt(page), dataPerPage, result[1], () =>
          constructApiResourceUrl(
            req,
            "tweet",
            qs.stringify({ q, page: parseInt(page) + 1 })
          )
        ),
        analyzePrevPage(parseInt(page), result[0].length, () =>
          constructApiResourceUrl(
            req,
            "tweet",
            qs.stringify({ q, page: parseInt(page) - 1 })
          )
        ),
        result[0].map((tweet) => {
          const assembledObj = new LinksAssembler<Tweet>(tweet, [
            {
              name: "self",
              targetUrl: constructApiResourceUrl(req, `tweet/${tweet.id}`),
            },
            {
              name: "tweets",
              targetUrl: constructApiResourceUrl(req, "tweet"),
            },
          ]);

          return assembledObj.getObject();
        })
      );
      return responseObject;
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tweetService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetService.update(+id, updateTweetDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tweetService.remove(+id);
  }
}
