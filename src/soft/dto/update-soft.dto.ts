import { PartialType } from '@nestjs/swagger';
import { CreateSoftDto } from './create-soft.dto';

export class UpdateSoftDto extends PartialType(CreateSoftDto) {}
