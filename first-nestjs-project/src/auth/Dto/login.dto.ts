import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: "Please enter the valid email!!" })
  @IsNotEmpty({ message: "Email is required!!" })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
