import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  gender?: string;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
