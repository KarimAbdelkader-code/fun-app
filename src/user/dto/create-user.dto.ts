import { IsString, IsEmail, IsDecimal, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDecimal()
  @Min(22.0)
  @Max(34.0)
  latitude: number;

  @IsDecimal()
  @Min(24.0)
  @Max(37.0)
  longitude: number;
}

