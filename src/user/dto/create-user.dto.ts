import { IsString, IsEmail, IsDecimal, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @IsDecimal()
  @Min(22.0)
  @Max(34.0)
  @ApiProperty({ description: 'Latitude of the user location' })
  latitude: number;

  @IsDecimal()
  @Min(24.0)
  @Max(37.0)
  @ApiProperty({ description: 'Longitude of the user location' })
  longitude: number;
}
