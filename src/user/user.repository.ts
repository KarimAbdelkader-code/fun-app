import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  
  // Custom create method
  async createUser(createUserDto: Partial<User>): Promise<User> {
    // Create a new user entity and assign properties from DTO
    const user = this.create(createUserDto); // create() is inherited from Repository<User>

    // Perform any additional processing if needed, like setting default values
    // e.g., user.status = 'active';

    return user;
  }

  // Custom save method
  async saveUser(user: User): Promise<User> {
    // Save the user entity to the database
    try {
      const savedUser = await this.save(user); // save() is inherited from Repository<User>
      return savedUser;
    } catch (error) {
      // Handle or log errors here if needed
      throw error;
    }
  }
}
