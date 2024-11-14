import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockImplementation((user) => {
              return { ...user }; // Return the user data without id
            }),
            save: jest.fn().mockImplementation((user) => {
              return {
                ...user,
                id: 1,
                created_at: new Date(),
                updated_at: new Date(),
              }; // Mock the save method to add an `id`, `created_at`, and `updated_at`
            }),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('signup', () => {
    it('should successfully sign up a user', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      const userWithoutId = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        latitude: 30.0444,
        longitude: 31.2357,
        city: 'Cairo', // Hardcoded city value
      };

      const now = new Date();
      const savedUser = {
        id: 1, // The `id` is added by `save`
        ...userWithoutId,
        created_at: now,
        updated_at: now,
      };

      // Mock axios to return a valid city response
      mockedAxios.get.mockResolvedValue({
        data: {
          results: [
            {
              components: {
                city: 'Cairo', // Hardcoded city value for the test
              },
            },
          ],
        },
      });

      const result = await userService.signup(createUserDto);

      // Function to compare only year, month, day, and hour of the timestamp
      const compareHours = (date1: Date, date2: Date): boolean => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate() &&
          date1.getHours() === date2.getHours()
        );
      };

      // Compare the created_at and updated_at timestamps to the hour level
      expect(compareHours(result.created_at, savedUser.created_at)).toBe(true);
      expect(compareHours(result.updated_at, savedUser.updated_at)).toBe(true);

      // Assertions for other properties
      // Assertions for other properties, excluding created_at and updated_at
      const { created_at, updated_at, ...savedUserWithoutDates } = savedUser;
      expect(result).toEqual(expect.objectContaining(savedUserWithoutDates)); // Now ignoring created_at and updated_at

      // Ensure that the create method was called with the correct parameters (without id)
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        city: 'Cairo', // Ensure city is hardcoded correctly
      });
    });

    it('should throw BadRequestException for invalid location', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        latitude: 10.0, // Invalid latitude
        longitude: 30.0,
      };

      await expect(userService.signup(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid email format', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'invalid-email', // Invalid email
        latitude: 30.0444,
        longitude: 31.2357,
      };

      await expect(userService.signup(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        latitude: 30.0444,
        longitude: 31.2357,
        city: 'Cairo',
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Mocking the findOne method
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.getUserById(1);

      // Ensure that the correct user is returned
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Mocking the findOne method to return undefined
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(userService.getUserById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
