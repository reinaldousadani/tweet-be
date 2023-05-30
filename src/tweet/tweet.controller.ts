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
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpCode,
  HttpStatus,
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
import { Public } from "src/auth/decorators/public.decorator";
import { JwtPayload } from "src/auth/dto/jwt-payload";

@Controller("tweet")
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  async create(
    @Body() createTweetDto: CreateTweetDto,
    @Req()
    req: Request & {
      user: JwtPayload;
    }
  ) {
    try {
      const user = req["user"] as JwtPayload;
      const tweet = await this.tweetService.create({
        ...createTweetDto,
        user: user,
      });

      return new LinksAssembler<Tweet>(tweet, [
        {
          name: "self",
          targetUrl: constructApiResourceUrl(req, `tweet/${tweet.id}`),
        },
        {
          name: `tweets`,
          targetUrl: constructApiResourceUrl(req, `tweet`),
        },
        {
          name: `user`,
          targetUrl: constructApiResourceUrl(req, `user/${tweet.user.id}`),
        },
      ]).getObject();
    } catch (error) {
      throw error;
    }
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
            {
              name: "user",
              targetUrl: constructApiResourceUrl(req, `user/${tweet.user.id}`),
            },
          ]);

          return assembledObj.getObject();
        })
      );
      return new LinksAssembler(responseObject, [
        { name: "self", targetUrl: constructApiResourceUrl(req, "tweet") },
      ]).getObject();
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    try {
      const tweet = await this.tweetService.findOne(id);
      if (!tweet) throw new NotFoundException();
      return new LinksAssembler<Tweet>(tweet, [
        {
          name: "self",
          targetUrl: constructApiResourceUrl(req, `tweet/${tweet.id}`),
        },
        {
          name: `tweets`,
          targetUrl: constructApiResourceUrl(req, `tweet`),
        },
        {
          name: `user`,
          targetUrl: constructApiResourceUrl(req, `user/${tweet.user.id}`),
        },
      ]).getObject();
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTweetDto: UpdateTweetDto,
    @Req() req: Request & { user: JwtPayload }
  ) {
    try {
      if (updateTweetDto["id"]) throw new BadRequestException();

      let tweet = await this.tweetService.findOne(id);
      if (!tweet) throw new NotFoundException();
      if (req.user.sub !== tweet.user.id) {
        throw new UnauthorizedException();
      }
      tweet = { ...tweet, content: updateTweetDto.content };

      await this.tweetService.update(id, tweet);
      return new LinksAssembler<Tweet>(tweet, [
        {
          name: "self",
          targetUrl: constructApiResourceUrl(req, `tweet/${tweet.id}`),
        },
        {
          name: `tweets`,
          targetUrl: constructApiResourceUrl(req, `tweet`),
        },
        {
          name: `user`,
          targetUrl: constructApiResourceUrl(req, `user/${tweet.user.id}`),
        },
      ]).getObject();
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @Req()
    req: Request & {
      user: JwtPayload;
    }
  ) {
    try {
      const tweet = await this.tweetService.findOne(id);
      if (!tweet) throw new NotFoundException();
      if (req.user.sub !== tweet.user.id) throw new UnauthorizedException();
      await this.tweetService.remove(id);
      return;
    } catch (error) {
      throw error;
    }
  }
}
