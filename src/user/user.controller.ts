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
  NotFoundException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginatedResultAssembler } from "src/commons/assemblers/paginated-result.assembler";
import { Request } from "express";
import {
  analyzeNextPage,
  analyzePrevPage,
  constructApiResourceUrl,
  isNumericString,
} from "src/commons/utils/utils";
import { dataPerPage } from "src/configs/constants";
import { LinksAssembler } from "src/commons/assemblers/links.assembler";
import * as qs from "qs";
import { User } from "./entities/user.entity";
import { Public } from "src/auth/decorators/public.decorator";
import { JwtPayload } from "src/auth/dto/jwt-payload";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      const res = await this.userService.create(createUserDto);
      return new LinksAssembler<User>({ ...res, password: "***" }, [
        {
          name: "self",
          targetUrl: constructApiResourceUrl(req, `user/${res.id}`),
        },
        {
          name: "users",
          targetUrl: constructApiResourceUrl(req, `user`),
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
      const result = await this.userService.findMany(q, parseInt(page));

      const responseObject = new PaginatedResultAssembler(
        result[1],
        analyzeNextPage(parseInt(page), dataPerPage, result[1], () => {
          return constructApiResourceUrl(
            req,
            "user",
            qs.stringify({ q, page: parseInt(page) + 1 })
          );
        }),
        analyzePrevPage(parseInt(page), result[0].length, () =>
          constructApiResourceUrl(
            req,
            "user",
            qs.stringify({ q, page: parseInt(page) - 1 })
          )
        ),
        result[0].map((user) => {
          const assembledObj = new LinksAssembler<User>(user, [
            {
              name: "self",
              targetUrl: constructApiResourceUrl(req, `user/${user.id}`),
            },
            {
              name: "users",
              targetUrl: constructApiResourceUrl(req, `user`),
            },
          ]);
          return assembledObj.getObject();
        })
      );

      return new LinksAssembler(responseObject, [
        { name: "self", targetUrl: constructApiResourceUrl(req, "user") },
      ]).getObject();
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    try {
      const result = await this.userService.findOne(id);
      if (!result) {
        throw new NotFoundException();
      } else {
        return new LinksAssembler<User>(result, [
          {
            name: "self",
            targetUrl: constructApiResourceUrl(req, `user/${result.id}`),
          },
          {
            name: "users",
            targetUrl: constructApiResourceUrl(req, `user`),
          },
        ]).getObject();
      }
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: JwtPayload }
  ) {
    try {
      if (updateUserDto["id"]) throw new BadRequestException();
      let user = await this.userService.dangerousFindOne(id);
      if (!user) throw new NotFoundException();
      if (req.user.sub !== user.id) throw new UnauthorizedException();
      user = { ...user, ...updateUserDto };
      await this.userService.update(id, user);
      return new LinksAssembler<User>(user, [
        {
          name: "self",
          targetUrl: constructApiResourceUrl(req, `user/${user.id}`),
        },
        {
          name: "users",
          targetUrl: constructApiResourceUrl(req, `user`),
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
      const user = await this.userService.findOne(id);
      if (!user) throw new NotFoundException();
      if (user.id !== req.user.sub) throw new UnauthorizedException();
      await this.userService.remove(id);
      return;
    } catch (error) {
      throw error;
    }
  }
}
