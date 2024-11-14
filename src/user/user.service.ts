import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  private readonly openCageApiKey = 'b6b02dcb066b4cc29f8cc50caf1f0766';
  private readonly openCageUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    // Validate the incoming DTO
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        const constraints = error.constraints;
        return constraints ? Object.values(constraints).join(', ') : '';
      });
      throw new BadRequestException(
        `Validation failed: ${errorMessages.join('; ')}`,
      );
    }

    const { name, email, latitude, longitude } = createUserDto;

    // Check if all required fields are provided and not null
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name is required and cannot be empty.');
    }

    if (!email || email.trim() === '') {
      throw new BadRequestException('Email is required and cannot be empty.');
    }

    if (!this.isValidEmailFormat(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    if (!latitude || latitude === null) {
      throw new BadRequestException('Latitude is required.');
    }

    if (!longitude || longitude === null) {
      throw new BadRequestException('Longitude is required.');
    }

    // Check if the location is within Egypt (latitude between 22 and 32)
    if (
      (latitude < 22.0 || latitude > 34.0) ||
      (longitude < 24.0 || longitude > 37.0)
    ) {
      throw new BadRequestException(
        'The location is outside of Egypt. Please provide valid coordinates within Egypt.',
      );
    }

    // Get the city dynamically based on latitude and longitude
    const city = await this.getCityFromCoordinates(latitude, longitude);

    if (!city) {
      throw new BadRequestException(
        'Could not determine the city based on the provided coordinates.',
      );
    }

    // Create the user
    const user = this.userRepository.create({
      name,
      email,
      latitude,
      longitude,
      city,
    });

    // Save the user in the database
    return await this.userRepository.save(user);
  }

  isValidEmailFormat(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  
  // Helper function to get the city from coordinates
  async getCityFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<string | null> {
    try {
      const response = await axios.get(this.openCageUrl, {
        params: {
          q: `${latitude},${longitude}`,
          key: this.openCageApiKey,
          language: 'en',
        },
      });

      const results = response.data.results;
      if (results && results.length > 0) {
        const city =
          results[0].components.city ||
          results[0].components.town ||
          results[0].components.village;
        return city || null; // Return 'null' if city is not found
      }

      throw new Error('City not found for the given coordinates');
    } catch (error) {
      console.error('Error fetching city:', error);

      // If the error is from axios, provide a more detailed message
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          `Error fetching city from coordinates. Axios error: ${error.message}`,
        );
      }

      // Otherwise, throw the default exception
      throw new BadRequestException(
        'Could not determine the city based on the provided coordinates.',
      );
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }
}
