import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsInt, IsBoolean } from 'class-validator';

// Decorator to mark this class as an entity for TypeORM
@Entity()
export class Product {
    
    // Primary key column with auto-generated UUID
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Column for product name with validation rules
    @Column()
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    // Column for product quantity with validation rules
    @Column()
    @IsNotEmpty({ message: 'Quantity is required' })
    @IsInt({ message: 'Quantity must be an integer' })
    quantity: number;

    // Column for product serial number with validation rules
    @Column()
    @IsNotEmpty({ message: 'Serial number is required' })
    @IsString({ message: 'Serial number must be a string' })
    serialNumber: string;

    // Column to store the creation date of the product
    @CreateDateColumn()
    createdAt: Date;

    // Column to store the last update date of the product
    @UpdateDateColumn()
    updatedAt: Date;

    // Column for soft deletion status with validation rules
    @Column({ default: false })
    @IsBoolean({ message: 'isDeleted must be a boolean' })
    isDeleted: boolean;
}
