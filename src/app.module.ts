import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'kimo',
      password: '7520',
      database: 'funapp_db',
      entities: [User], // Ensure the User entity is registered here
      synchronize: true, // Set to false in production
    }),
    UserModule, // Import the UserModule
  ],
})
export class AppModule {}
