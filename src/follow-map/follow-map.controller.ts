import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowMapService } from './follow-map.service';
import { CreateFollowMapDto } from './dto/create-follow-map.dto';
import { UpdateFollowMapDto } from './dto/update-follow-map.dto';

@Controller('follow-map')
export class FollowMapController {
  constructor(private readonly followMapService: FollowMapService) {}

  @Post()
  create(@Body() createFollowMapDto: CreateFollowMapDto) {
    return this.followMapService.create(createFollowMapDto);
  }

  @Get()
  findAll() {
    return this.followMapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followMapService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowMapDto: UpdateFollowMapDto) {
    return this.followMapService.update(+id, updateFollowMapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followMapService.remove(+id);
  }
}
