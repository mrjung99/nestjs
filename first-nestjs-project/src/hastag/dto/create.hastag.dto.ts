import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHastagDto {
  @IsNotEmpty()
  @IsString()
  tag: string;
}
