import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: number;

  @Column()
  @ApiProperty({ description: 'User name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'User email' })
  email: string;

  @Column('decimal', { precision: 9, scale: 6 })
  @ApiProperty({ description: 'User latitude' })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6 })
  @ApiProperty({ description: 'User longitude' })
  longitude: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'User account creation timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'User account update timestamp' })
  updated_at: Date;

  @Column()
  @ApiProperty({ description: 'City of the user' })
  city: string;
}
