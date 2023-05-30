import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowMapDto } from './create-follow-map.dto';

export class UpdateFollowMapDto extends PartialType(CreateFollowMapDto) {}
