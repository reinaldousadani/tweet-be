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

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.userService.create(createUserDto);
      return { ...res, password: "***" };
    } catch (error) {
      throw error;
    }
  }

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

      return responseObject;
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const result = await this.userService.findOne(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
