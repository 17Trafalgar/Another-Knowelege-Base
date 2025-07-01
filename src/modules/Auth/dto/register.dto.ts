import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EGender } from 'src/utils/enum';
import { IsNormalizedPhone } from '../validator/phone.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsNormalizedPhone()
  phone: string;

  @IsEnum(EGender)
  @IsNotEmpty()
  gender: EGender;

  @IsDate()
  @IsOptional()
  birthday: Date;
}
