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
import { GetUserResponseDto } from "./dto/get-user-response.dto";
import { Request } from "express";
import {
  analyzeNextPage,
  analyzePrevPage,
  constructApiResourceUrl,
  isNumericString,
} from "src/commons/utils/utils";
import { dataPerPage } from "src/configs/constants";
import qs from "querystring";
import { LinksAssembler } from "src/commons/assemblers/links.assembler";

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
    page = typeof page === "undefined" || !isNumericString(page) ? "1" : "";
    try {
      const result = await this.userService.findMany(q, parseInt(page));
      const responseObject = new PaginatedResultAssembler(
        result[1],
        analyzeNextPage(parseInt(page), dataPerPage, result[1], () =>
          constructApiResourceUrl(
            req,
            "user",
            qs.stringify({ q, page: parseInt(page) + 1 })
          )
        ),
        analyzePrevPage(parseInt(page), result[0].length, () =>
          constructApiResourceUrl(
            req,
            "user",
            qs.stringify({ q, page: parseInt(page) - 1 })
          )
        ),
        result[0].map((user) => {
          const assembledObj = new LinksAssembler<GetUserResponseDto>(
            new GetUserResponseDto(user.id, user.username),
            [
              {
                name: "self",
                targetUrl: constructApiResourceUrl(req, `user/${user.id}`),
              },
              {
                name: "user",
                targetUrl: constructApiResourceUrl(req, `user`),
              },
            ]
          );
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
    return this.userService.findOne(+id);
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
