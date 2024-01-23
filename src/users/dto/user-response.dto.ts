import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, MaxLength } from 'class-validator';
import { hashSync } from 'bcryptjs';

export class ResponseUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => hashSync(value, 10), {
    groups: ['transform'],
  })
  @Exclude()
  password: string;
}
