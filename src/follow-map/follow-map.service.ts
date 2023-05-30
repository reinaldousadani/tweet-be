import { Injectable } from '@nestjs/common';
import { CreateFollowMapDto } from './dto/create-follow-map.dto';
import { UpdateFollowMapDto } from './dto/update-follow-map.dto';

@Injectable()
export class FollowMapService {
  create(createFollowMapDto: CreateFollowMapDto) {
    return 'This action adds a new followMap';
  }

  findAll() {
    return `This action returns all followMap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} followMap`;
  }

  update(id: number, updateFollowMapDto: UpdateFollowMapDto) {
    return `This action updates a #${id} followMap`;
  }

  remove(id: number) {
    return `This action removes a #${id} followMap`;
  }
}
