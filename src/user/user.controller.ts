import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or location outside of Egypt.',
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signup(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile data' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user data.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}
